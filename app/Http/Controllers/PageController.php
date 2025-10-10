<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function home()
    {
        return Inertia::render('Home');
    }

    public function projects()
    {
        return redirect()->route('projects.index');
    }
}