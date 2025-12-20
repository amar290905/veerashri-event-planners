import json
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import logout

from .models import Contact, Newsletter


def home(request):
    return render(request, "final.html")


@staff_member_required
def admin_page(request):
    contacts = Contact.objects.order_by("-created_at")
    newsletters = Newsletter.objects.order_by("-created_at")

    context = {
        "contacts": contacts,
        "newsletters": newsletters,
        "contact_count": contacts.count(),
        "newsletter_count": newsletters.count(),
        "event_count": 0,
    }
    return render(request, "admin.html", context)


@csrf_exempt
@require_POST
def contact_api(request):
    # Accept JSON body or form-encoded POST bodies (fallback)
    data = {}
    if request.content_type == 'application/json':
        try:
            data = json.loads(request.body.decode("utf-8") or '{}')
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format."}, status=400)
    else:
        # request.POST works for form submissions and FormData
        data = {k: v for k, v in request.POST.items()}

    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not (name or email or message):
        return JsonResponse({"success": False, "message": "No data provided."}, status=400)

    Contact.objects.create(
        name=name,
        phone=phone,
        email=email,
        message=message,
    )

    return JsonResponse({"success": True, "message": "Message sent successfully!"})


@csrf_exempt
@require_POST
def newsletter_api(request):
    # Accept JSON body or form-encoded POST bodies
    data = {}
    if request.content_type == 'application/json':
        try:
            data = json.loads(request.body.decode("utf-8") or '{}')
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format."}, status=400)
    else:
        data = {k: v for k, v in request.POST.items()}

    email = data.get("email", "").strip()
    if not email:
        return JsonResponse({"success": False, "message": "Email is required."}, status=400)

    obj, created = Newsletter.objects.get_or_create(email=email)
    msg = "Subscribed successfully!" if created else "You are already subscribed."
    return JsonResponse({"success": True, "message": msg})

def admin_logout(request):
    logout(request)
    return redirect('home')



def contacts_api(request):
    contacts = Contact.objects.all().order_by("-id")

    data = [
        {
            "id": c.id,
            "name": c.name,
            "phone": c.phone,
            "email": c.email,
            "message": c.message,
            "created_at": c.created_at.isoformat()
        }
        for c in contacts
    ]

    return JsonResponse({
        "success": True,
        "contacts": data
    })


def newsletter_list_api(request):
    subs = Newsletter.objects.all().order_by("-id")

    data = [
        {
            "id": s.id,
            "email": s.email,
            "subscribed_at": s.created_at.isoformat()
        }
        for s in subs
    ]

    return JsonResponse({
        "success": True,
        "subscribers": data
    })
