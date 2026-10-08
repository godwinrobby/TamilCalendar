<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    use HasFactory;

    protected $table = 'articles';

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'category_id',
        'status',
        'published_at',
    ];

    // Always expose the resolved absolute URL alongside the raw value.
    protected $appends = ['featured_image_url'];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Resolve featured_image to a proper absolute URL, whatever format is stored:
     *  - full URL (https://...)              -> returned as-is
     *  - "public/storage/uploads/x.png"      -> base + /public/storage/uploads/x.png (prod layout)
     *  - "storage/uploads/x.png"             -> base + /public/storage/uploads/x.png (prod layout)
     *  - "uploads/x.png"                     -> base + /public/storage/uploads/x.png (prod layout)
     *  - bare filename "x.jpg"               -> base + /public/storage/uploads/x.jpg (prod layout)
     *  - null/empty                          -> null
     */
    protected function featuredImageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                $raw = $this->attributes['featured_image'] ?? null;
                if (!$raw) {
                    return null;
                }
                $raw = trim($raw);

                // Already absolute
                if (preg_match('#^https?://#i', $raw)) {
                    return $raw;
                }

                // Normalise to a path relative to the public disk root
                $path = ltrim($raw, '/');
                $path = preg_replace('#^(public/)?storage/#', '', $path);
                // Bare filenames (legacy seed data like "tamil-literature.jpg")
                // live under uploads/
                if (!str_contains($path, '/')) {
                    $path = 'uploads/' . $path;
                }

                // Base of the API host, e.g. https://api.veltamilcalendar.com
                // Production serves Laravel from a /public sub-directory, so
                // images live under {base}/public/storage/<path>.
                $base = rtrim(config('app.url', url('/')), '/');
                // Local dev (php artisan serve) serves public/ as docroot,
                // so images live under {base}/storage/<path>.
                $servesFromPublicSubdir = (bool) preg_match('#/public(/api)?$#', $base)
                    || str_contains($base, 'veltamilcalendar.com');

                if ($servesFromPublicSubdir) {
                    return $base . '/public/storage/' . $path;
                }

                return $base . '/storage/' . $path;
            }
        );
    }
}