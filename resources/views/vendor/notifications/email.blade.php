<x-mail::message>
{{-- Optional Logo --}}
<div style="text-align: center; margin-bottom: 20px;">
    <img src="{{ asset('images/Labuan.jpg') }}" alt="PLRE Logo" style="width: 150px;">
</div>
# Hi from PLRE!

{{-- Intro Lines --}}
@foreach ($introLines as $line)
{{ $line }}

@endforeach

{{-- Action Button --}}
@isset($actionText)
<?php
    $color = match ($level) {
        'success', 'error' => $level,
        default => 'primary',
    };
?>
<x-mail::button :url="$actionUrl" :color="$color">
{{ $actionText }}
</x-mail::button>
@endisset

{{-- Outro Lines --}}
@foreach ($outroLines as $line)
{{ $line }}

@endforeach

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@else
Regards,<br>
PLRE Labuan
@endif

{{-- Subcopy --}}
@isset($actionText)
<x-slot:subcopy>
If you're having trouble clicking the "**{{ $actionText }}**" button, copy and paste the URL below into your web browser:  
[{{ $displayableActionUrl }}]({{ $actionUrl }})
</x-slot:subcopy>
@endisset

---

Need help? Contact us at [support@plre.labuan.my](mailto:support@plre.labuan.my)

</x-mail::message>
