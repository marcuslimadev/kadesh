<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
        'document',
        'person_type',
        'phone',
        'bio',
        'skills',
        'rating',
        'total_ratings',
        'wallet_balance',
        'is_active',
        'last_activity',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'skills' => 'array',
            'last_activity' => 'datetime',
            'wallet_balance' => 'decimal:2',
            'rating' => 'decimal:2',
        ];
    }

    // Relações
    public function contractedProjects()
    {
        return $this->hasMany(Project::class, 'contractor_id');
    }

    public function wonProjects()
    {
        return $this->hasMany(Project::class, 'winner_id');
    }

    public function bids()
    {
        return $this->hasMany(Bid::class, 'provider_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function givenReviews()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function receivedReviews()
    {
        return $this->hasMany(Review::class, 'reviewed_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    // Métodos auxiliares
    public function isContractor()
    {
        return $this->user_type === 'contractor';
    }

    public function isProvider()
    {
        return $this->user_type === 'provider';
    }

    public function updateRating()
    {
        $reviews = $this->receivedReviews();
        $this->rating = $reviews->avg('rating') ?? 0;
        $this->total_ratings = $reviews->count();
        $this->save();
    }
}
