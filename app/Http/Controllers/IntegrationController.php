<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class IntegrationController extends Controller
{
    public function index()
    {
        return Inertia::render('System/Integration/Index', [
            'currentRoute' => Route::currentRouteName(),
        ]);
    }

    public function store()
    {
        $validate = request()->validate([
            
        ]);

        DB::beginTransaction();

        try {

            DB::commit();

            activity()->performedOn()->causedBy(auth()->user())->log('');

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }
}
