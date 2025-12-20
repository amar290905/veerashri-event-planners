from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("admin-page/", views.admin_page, name="admin_page"),
    path("admin-logout/", views.admin_logout, name="admin_logout"),
    path("api/contacts", views.contacts_api, name="contacts_api"),
    path("api/contact/", views.contact_api, name="contact_api"),
    path("api/newsletter/", views.newsletter_api, name="newsletter_post"),
    path("api/newsletter/list", views.newsletter_list_api, name="newsletter_api"),
]
