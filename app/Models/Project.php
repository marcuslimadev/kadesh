<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'contractor_id',
        'title',
        'description',
        'max_budget',
        'winning_bid',
        'winner_id',
        'status',
        'bidding_ends_at',
        'project_deadline',
        'required_skills',
        'attachments',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'max_budget' => 'decimal:2',
            'winning_bid' => 'decimal:2',
            'bidding_ends_at' => 'datetime',
            'project_deadline' => 'datetime',
            'required_skills' => 'array',
            'attachments' => 'array',
            'is_featured' => 'boolean',
        ];
    }

    // Relações
    public function contractor()
    {
        return $this->belongsTo(User::class, 'contractor_id');
    }

    public function winner()
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // Métodos auxiliares
    public function isOpen()
    {
        return $this->status === 'open' && $this->bidding_ends_at > now();
    }

    public function isClosed()
    {
        return $this->status !== 'open' || $this->bidding_ends_at <= now();
    }

    public function getLowestBid()
    {
        return $this->bids()->where('status', 'pending')->min('amount');
    }

    public function getBidsCount()
    {
        return $this->bids()->where('status', 'pending')->count();
    }
}
