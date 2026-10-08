<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:102400', // 100MB in KB
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            // Store on the "public" disk: storage/app/public/uploads/xxx
            // Served via the public/storage symlink.
            // NOTE: production serves the API from a /public sub-path, so we
            // store only the relative path (uploads/xxx) and let the
            // Article::featuredImageUrl accessor build the full URL.
            $path = $file->storeAs('uploads', $filename, 'public');

            return response()->json([
                'url' => Storage::url($path),
                'path' => $path,
                'filename' => $filename,
            ]);
        }

        return response()->json(['message' => 'No file uploaded'], 422);
    }
}