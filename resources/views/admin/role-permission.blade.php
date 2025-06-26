@extends('layouts.app')

@section('title', 'Role Management')

@section('content')
<div class="container">
    <h2 class="mb-4">Role Permission Management</h2>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <form action="{{ route('role-permission.update') }}" method="POST">
        @csrf
        <table class="table">
            <thead>
                <tr>
                    <th>Role</th>
                    <th>Permissions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($roles as $role)
                    <tr>
                        <td>{{ ucfirst($role->display_name) }}</td>
                        <td>
                            <div class="d-flex flex-wrap">
                                @foreach($permissions as $permission)
                                    <div class="form-check me-3">
                                        <input type="checkbox" name="roles[{{ $role->id }}][permissions][]"
                                               value="{{ $permission->id }}"
                                               class="form-check-input"
                                               id="perm_{{ $role->id }}_{{ $permission->id }}"
                                               {{ $role->permissions->contains($permission->id) ? 'checked' : '' }}>
                                        <label for="perm_{{ $role->id }}_{{ $permission->id }}" class="form-check-label">
                                            {{ ucfirst($permission->name) }}
                                        </label>
                                        
                                    </div>
                                @endforeach
                            </div>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <button type="submit" class="btn btn-primary mt-3">Save Changes</button>
    </form>
</div>
@endsection
