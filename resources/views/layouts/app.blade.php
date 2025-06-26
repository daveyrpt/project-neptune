<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Panel')</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>
    <style>
        body { background-color: #f8f9fa; }
        .sidebar {
            width: 250px;
            min-height: 100vh;
            background: #343a40;
            color: white;
            padding-top: 20px;
            position: fixed;
        }
        .sidebar a {
            color: white;
            display: block;
            padding: 10px 20px;
            text-decoration: none;
        }
        .sidebar a:hover {
            background: #495057;
        }
        .content {
            margin-left: 250px;
            padding: 20px;
        }
    </style>
</head>
<body>

    <!-- Sidebar -->
    <div class="sidebar">
        <h4 class="text-center">Admin Panel</h4>
        <a href="{{ route('dashboard') }}">Dashboard</a>
        <a href="{{ route('role-permission.index') }}">Role Management</a>
        <a href="#">Users</a>
        <a href="#">Settings</a>
        <a href="{{ route('logout') }}" 
           onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
            Logout
        </a>

        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
            @csrf
        </form>
    </div>

    <!-- Main Content -->
    <div class="content">
        <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-3">
            <div class="container-fluid">
                <span class="navbar-brand">Welcome, {{ auth()->user()->name ?? 'Guest' }}</span>
            </div>
        </nav>

        <div class="container">
            @yield('content')
        </div>
    </div>

</body>
</html>
