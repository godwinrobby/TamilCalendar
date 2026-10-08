<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $articles = Article::with('category')->paginate((int) $perPage);
        return response()->json($articles);
    }

    public function publicIndex(Request $request)
    {
        $categorySlug = $request->query('category');
        $query = Article::with('category')->where('status', 'published');

        if ($categorySlug) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        $articles = $query->orderByDesc('published_at')->get();
        $categories = Category::orderBy('name')->get();

        return response()->json([
            'categories' => $categories,
            'articles' => $articles,
        ]);
    }

    public function publicShow(Request $request, string $slug = '')
    {
        // $slug comes from /articles/{slug}. NOTE: the {slug} placeholder must
        // NOT be named {article}, otherwise Laravel's implicit model binding
        // tries to resolve an Article by ID and throws a 404 before this
        // method runs (that is the production bug). Fall back to the last
        // URL segment so it also works if the parameter name differs.
        $identifier = $slug ?: basename(trim($request->path(), '/'));
        if ($identifier === 'articles') {
            $identifier = $slug;
        }

        // Support both slug and numeric ID lookups
        $query = Article::with('category')->where('status', 'published');

        if (is_numeric($identifier)) {
            $query->where('id', (int) $identifier);
        } else {
            $query->where('slug', $identifier);
        }

        if (is_numeric($identifier)) {
            $query->where('id', (int) $identifier);
        } else {
            $query->where('slug', $identifier);
        }

        $article = $query->first();

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return response()->json($article);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles,slug',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        $article = Article::create($request->all());
        return response()->json($article, 201);
    }

    public function show(Article $article)
    {
        return response()->json($article->load('category'));
    }

    public function update(Request $request, Article $article)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles,slug,' . $article->id,
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        $article->update($request->all());
        return response()->json($article);
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return response()->json(null, 204);
    }
}