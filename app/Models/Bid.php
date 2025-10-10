<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bid extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'provider_id',
        'amount',
        'proposal',
        'delivery_time_days',
        'status',
        'attachments',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'attachments' => 'array',
            'submitted_at' => 'datetime',
        ];
    }

    // Relações
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    // Métodos auxiliares
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isAccepted()
    {
        return $this->status === 'accepted';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }
}
