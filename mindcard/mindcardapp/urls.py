from django.urls import path

app_name = "mindcardapp"
from . import views
urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.log_in, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.log_out, name="logout"),
    path("create_deck", views.create_deck, name="create_deck"),
    path("deck", views.deck, name="deck"),
    path("edit_card", views.edit_card, name="edit_card"),
    path("delete_card", views.delete_card, name="delete_card"),
    path("rename_deck", views.rename_deck, name="rename_deck"),
    path("delete_deck", views.delete_deck, name="delete_deck"),
    path("study", views.study, name="study"),
]
