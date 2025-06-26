<?php

namespace App\Http\Middleware;

use App\Models\CancelledReceipt;
use App\Models\FloatCash;
use App\Models\FloatCashRequest;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Notification;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        //List all permission
        $permissions = $request->user() ? $request->user()->role->permissions->pluck('name') : [];
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'avatar' => $request->user() ? $request->user()->getAvatarAttribute() : null,
                'permissions' => $request->user()
                    ? Cache::remember("user_permissions_{$request->user()->id}", now()->addMinutes(30), function () use ($request) {
                        return $request->user()->role->permissions->pluck('name');
                    })
                    : [],
                'sidemenu_badge' => [
                    'batal_resit' => CancelledReceipt::where('status', CancelledReceipt::STATUS_REQUESTED)->count(),
                    'wang_apungan' => FloatCashRequest::where('status', FloatCashRequest::STATUS_REQUESTED)->count(),
                ],
                'notifications' => $user 
                ? $user->unreadNotifications->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'type' => class_basename($notification->type),
                        'data' => $notification->data,
                        'created_at' => $notification->created_at->diffForHumans(),
                        'link' => $notification->data,
                    ];
                })
                : [],
            ],
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                ];
            },
        ];
    }
}
