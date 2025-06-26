<?php

namespace App\Http\Controllers;

use App\Models\CashierManagement;
use App\Models\CollectionCenter;
use App\Models\Counter;
use App\Models\FloatCash;
use App\Models\OpenedCounter;
use App\Models\Role;
use App\Models\SettingDefaultCashierLocation;
use App\Models\TerminalManagement;
use App\Models\User;
use Illuminate\Http\Request;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class UserController extends Controller
{
    public function index()
    {
        auth()->user()->hasPermission('read user') ?: abort(403);

        $users = QueryBuilder::for(User::class)
        ->allowedFilters([
            AllowedFilter::callback('search', function ($query, $value) {
                $query->select('users.*')
                    ->where(function ($query) use ($value) {
                        $query->where('name', 'LIKE', '%' . $value . '%')
                            ->orWhere('id', 'LIKE', '%' . $value . '%');
                    });
            }),
            AllowedFilter::callback('role', function ($query, $value) {
                $query->where('role_id', $value);
            }),
            AllowedFilter::callback('staff_id', function ($query, $value) {
                $query->where('staff_id', $value);
            })
        ])
        ->with('latestChange.causer', 'firstChange.causer')
        ->paginate(10);

        $allUserId = User::all();

        return Inertia::render('System/UserManagement', [
            'currentRoute' => Route::currentRouteName(),
            'users' => $users,
            'allUserId' => $allUserId,
            'roles' => Role::all()
        ]);
    }

    public function print()
    {
        $items = User::all();

        $pdf = Pdf::loadView('pdf.users', compact('items'));

        return $pdf->stream();
    }

    public function store()
    {
        auth()->user()->hasPermission('create user') ?: abort(403);

        $validate = request()->validate([
            'staff_id' => 'required',
            'user_name' => 'required',
            'email' => 'required|email|unique:users,email',
            'google_email' => 'nullable|email|unique:users,google_email,',
            'role_id' => 'required|exists:roles,id',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',      
                'regex:/[A-Z]/',      
                'regex:/[0-9]/',      
                'regex:/[@$!%*#?&]/', 
            ],
            'is_active' => 'required|boolean',
        ], [
            'staff_id.required' => 'Masukkan ID Pengguna',
            'staff_id.unique' => 'ID Pengguna telah digunakan',
            'user_name.required' => 'Masukkan Nama Pengguna',
            'email.required' => 'Masukkan Emel Pengguna',
            'email.unique' => 'Emel Pengguna telah digunakan',
            'google_email.unique' => 'Emel Google telah digunakan',
            'role_id.required' => 'Pilih Peranan Pengguna',
            'password.required' => 'Set Kata Laluan',
            'password.regex' => 'Kata laluan mestilah mengandungi setidaknya satu huruf besar, satu huruf kecil, satu nombor dan satu simbol.',
            'password.min' => 'Kata laluan mestilah mengandungi minimal 8 pangkal.',
            'is_active.required' => 'Pilih Status akaun Pengguna',
        ]);

        DB::beginTransaction();

        try {

            $user = User::create([
                'staff_id' => $validate['staff_id'],
                'name' => $validate['user_name'],
                'email' => $validate['email'],
                'google_email' => $validate['google_email'] ?? null,
                'role_id' => $validate['role_id'],
                'password' => bcrypt($validate['password']),
                'is_active' => $validate['is_active'],
            ]);

            DB::commit();

            activity()->performedOn($user)->causedBy(auth()->user())->log('Pengguna baru telah ditambah');

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }

    }

    public function update(User $user)
    {
        auth()->user()->hasPermission('update user') ?: abort(403);

        $validate = request()->validate([
            'staff_id' => 'required|unique:users,staff_id,' . $user->id,
            'user_name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'google_email' => 'nullable|email|unique:users,google_email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'password' => [
                'nullable',
                'string',
                'min:8',
                'regex:/[a-z]/',      
                'regex:/[A-Z]/',      
                'regex:/[0-9]/',      
                'regex:/[@$!%*#?&]/', 
            ],
            'is_active' => 'required|boolean',
        ], [
            'staff_id.required' => 'Masukkan ID Pengguna',
            'staff_id.unique' => 'ID Pengguna telah digunakan',
            'user_name.required' => 'Masukkan Nama Pengguna',
            'email.required' => 'Masukkan Emel Pengguna',
            'email.unique' => 'Emel Pengguna telah digunakan',
            'google_email.unique' => 'Emel Google telah digunakan',
            'role_id.required' => 'Pilih Peranan Pengguna',
            'password.regex' => 'Kata laluan mestilah mengandungi setidaknya satu huruf besar, satu huruf kecil, satu nombor dan satu simbol.',
            'password.min' => 'Kata laluan mestilah mengandungi minimal 8 pangkal.',
            'is_active.required' => 'Pilih Status akaun Pengguna',
        ]);
    
        DB::beginTransaction();
    
        try {
            $user->update([
                'staff_id' => $validate['staff_id'],
                'name' => $validate['user_name'],
                'email' => $validate['email'],
                'role_id' => $validate['role_id'],
                'google_email' => $validate['google_email'],
                'is_active' => $validate['is_active'],
            ]);
              
            if (!empty($validate['password'])) {
                $user->password = bcrypt($validate['password']);
                $user->password_changed_at = now();
                $user->save(); 
            }
    
            DB::commit();
    
            activity()->performedOn($user)->causedBy(auth()->user())->log('Maklumat pengguna telah dikemaskini');
    
            return redirect()->back()->with('success', 'Proses berjaya!');
    
        } catch (\Exception $e) {
    
            DB::rollBack();
    
            return response()->json(['error' => 'Failed to update user', 'message' => $e->getMessage()], 500);
        }
    }    

    public function destroy(User $user)
    {
        auth()->user()->hasPermission('delete user') ?: abort(403);

        DB::beginTransaction();
    
        try {
            $user->delete();
    
            DB::commit();
    
            activity()->performedOn($user)->causedBy(auth()->user())->log("Maklumat pengguna telah dipadam");
    
            return redirect()->back()->with('success', 'Proses berjaya!');
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function counterAndCollectionCenter()
    {
        auth()->user()->hasPermission('read counter and collection center') ?: abort(403);

        # Redirect Non Cashier to Dashboard
        if(auth()->user()->role->name != 'cashier') {
            return redirect()->intended(RouteServiceProvider::HOME);
        }

        $default_cashier_location = SettingDefaultCashierLocation::where('user_id', auth()->user()->id)->first();
        
        $default_cashier_location = [
            'collection_center_id' => $default_cashier_location->collection_center_id ?? '1',
            'counter_id' => $default_cashier_location->counter_id ?? '1',
            'counter_name' => !empty($default_cashier_location->counter_id) ? Counter::where('id', $default_cashier_location->counter_id)->first()->name : '1',
        ];

        return Inertia::render('Auth/SelectCounter', [
            'currentRoute' => Route::currentRouteName(),
            'collection_centers'   => CollectionCenter::with('counters')->get(),
            'default_cashier_location' => $default_cashier_location
        ]);
    }

    public function storeCounterAndCollectionCenter()
    {
        auth()->user()->hasPermission('create counter and collection center') ?: abort(403);
      
        $validate = request()->validate([
            'collection_center_id' => 'required|exists:collection_centers,id',
            'counter_id' => 'required|exists:counters,id',
        ]);
   
        DB::beginTransaction();

        try {
            if (!$this->isCounterOpenedByAdmin($validate)) {    
                DB::rollBack();
                return redirect()->back()->with('error', 'Kaunter belum dibuka oleh penyelia!')->withInput();
            }

            if ($this->isCounterBeingUsedByAnotherCashier($validate)) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Kaunter telah dibuka oleh juruwang lain!')->withInput();
            }

            if ($this->isCounterClosed($validate)) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Kaunter telah ditutup!')->withInput();
            }

            if ($this->isPreviousCounterOpened($validate)) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Sila tutup kaunter sebelum membuka kaunter baru!')->withInput();
            }

            $counter_opened = $this->createOrUpdateTodayCounter($validate);

            $this->createOrUpdateTerminalManagement($validate);

            DB::commit();

            activity()->performedOn($counter_opened)->causedBy(auth()->user())->log("Juruwang telah membuka kaunter");

            return redirect()->intended(RouteServiceProvider::HOME);

        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function openFloatingCash()
    {
        auth()->user()->hasPermission('open floating cash') ?: abort(403);

        if (auth()->user()->role->name === Role::NAME_CASHIER && empty(auth()->user()->currentCashierOpenedCounter()->first()->counter_id)) {
            return to_route('counter-and-collection-center.index')->with('error', 'Sila Pilih Kaunter terdahulu!');
        }

        $validate = request()->validate([
            'RM100' => 'nullable|numeric|min:0',
            'RM50' => 'nullable|numeric|min:0',
            'RM20' => 'nullable|numeric|min:0',
            'RM10' => 'nullable|numeric|min:0',
            'RM5' => 'nullable|numeric|min:0',
            'RM1' => 'nullable|numeric|min:0',

            'RM0.50' => 'nullable|numeric|min:0',
            'RM0.20' => 'nullable|numeric|min:0',
            'RM0.10' => 'nullable|numeric|min:0',
            'RM0.05' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {

            $validate['user_id'] = auth()->user()->id;
            $validate['collection_center_id'] = auth()->user()->currentCashierOpenedCounter()->first()->collection_center_id; 
            $validate['counter_id'] = auth()->user()->currentCashierOpenedCounter()->first()->counter_id;
            $validate['set_at'] = Carbon::now();

            $float_cash = FloatCash::create(array_merge(
                $validate,
                [
                    'RM0_50' => request('RM0.5'),
                    'RM0_20' => request('RM0.2'),
                    'RM0_10' => request('RM0.1'),
                    'RM0_05' => request('RM0.05'),
                ]
            ));

            $amount = $float_cash->getTotalAmount();
         
            $this->createOrUpdateCashierManagement($validate, $amount);

            DB::commit();

            activity()->performedOn($float_cash)->causedBy(auth()->user())->log('Juruwang telah mengesahkan wang apungan untuk kaunter ' .  auth()->user()->currentCashierOpenedCounter()->first()->counter_id);

            return redirect()->back()->with('success', 'Proses berjaya!');

        } catch (\Exception $e) {

            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Proses gagal!')->withInput();
        }
    }

    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return redirect()->back();
    }

    protected function isCounterOpenedByAdmin(array $data): bool
    {
        return OpenedCounter::where('collection_center_id', $data['collection_center_id'])
            ->where('counter_id', $data['counter_id'])
            ->where('status', OpenedCounter::STATUS_OPEN_BY_ADMIN)
            ->whereDate('opened_at', Carbon::today())
            ->exists();
    }

    protected function isCounterBeingUsedByAnotherCashier(array $data): bool
    {
        return OpenedCounter::where('collection_center_id', $data['collection_center_id'])
            ->where('counter_id', $data['counter_id'])
            ->where('user_id', '!=', auth()->id())
            ->where('status', OpenedCounter::STATUS_OPEN_BY_CASHIER)
            ->whereDate('opened_at', Carbon::today())
            ->exists();
    }

    protected function isCounterClosed(array $data): bool
    {
        return OpenedCounter::where('collection_center_id', $data['collection_center_id'])
            ->where('counter_id', $data['counter_id'])
            ->where('status', OpenedCounter::STATUS_CLOSE_BY_ADMIN)
            ->whereDate('opened_at', Carbon::today())
            ->exists();
    }

    protected function isPreviousCounterOpened(array $data): bool
    {
        if(empty(auth()->user()->currentCashierOpenedCounter()->first()->counter_id)) {
            return false;
        } else {
            return auth()->user()->currentCashierOpenedCounter()->first()->counter_id !== $data['counter_id'];
        }
    }

    protected function createOrUpdateTodayCounter(array $data): OpenedCounter
    {
        $existing = OpenedCounter::where('user_id', auth()->id())
            ->whereDate('opened_at', now()->toDateString())
            ->first();

        $payload = [
            'opened_at' => now(),
            'collection_center_id' => $data['collection_center_id'],
            'counter_id' => $data['counter_id'],
            'status' => OpenedCounter::STATUS_OPEN_BY_CASHIER,
        ];

        if ($existing) {
            $existing->update($payload);
            return $existing;
        }

        return OpenedCounter::create(array_merge($payload, ['user_id' => auth()->id()]));
    }

    protected function createOrUpdateTerminalManagement(array $data): TerminalManagement
    {
        $existing = TerminalManagement::where('user_id', auth()->id())
            ->whereDate('receipt_date', now()->toDateString())
            ->first();

        $payload = [
            'user_id' => auth()->id(),
            'collection_center_id' => $data['collection_center_id'],
            'counter_id' => $data['counter_id'],
            'receipt_date' => now(),
            'counter_status' => 'active',
        ];

        if ($existing) {
            $existing->update($payload);
            return $existing;
        }

        return TerminalManagement::create($payload);
    }

    protected function createOrUpdateCashierManagement(array $data, $amount): CashierManagement
    {
        $existing = CashierManagement::where('user_id', auth()->id())
            ->whereDate('created_at', now()->toDateString())
            ->first();

        $payload = [
            'user_id' => auth()->id(),
            'collection_center_id' => $data['collection_center_id'],
            'counter_id' => $data['counter_id'],
            'created_at' => now(),
            'retail_money' => $amount ?? '',
        ];

        if ($existing) {
            $existing->update($payload);
            return $existing;
        }

        return CashierManagement::create($payload);
    }

}
