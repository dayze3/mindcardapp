from django.contrib import messages
from django.core.exceptions import ValidationError
from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from .forms import Register, LogIn, AddCard, EditCard, DeleteCard, RenameDeck, DeleteDeck, StudySettings
from .models import Card, Deck
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.forms.models import model_to_dict
import json
import random
from django.utils import timezone
import datetime
import pytz

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = Register(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            confirm = form.cleaned_data["confirm_password"]
            if password == confirm:
                entered_username = username
                same_username = User.objects.filter(username=entered_username)
                if len(same_username) == 0:
                    user = User.objects.create_user(username, email, password)
                    user.save()
                    group = Group.objects.get(name='People')
                    group.user_set.add(user)
                    request.session['deck'] = None
                    return HttpResponseRedirect(reverse("mindcardapp:index"))
                else:
                    print('username taken')
                    messages.error(request, "Username already taken")
            else:
                print('password does not match')
                messages.error(request,"Password does not match")
            return HttpResponseRedirect(reverse("mindcardapp:register"))
        else:
            return render(request, "mindcardapp/register.html", {"form": form})
    else:
        return render(request, "mindcardapp/register.html", {"form": Register()})

def log_in(request):
    if request.method == 'POST':
        form = LogIn(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse('mindcardapp:index'))
            else:
                messages.error(request,'Invalid credentials')
                return HttpResponseRedirect(reverse("mindcardapp:login"))
    else:
        form = LogIn()
        return render(request, 'mindcardapp/login.html', {"form": form})

@login_required
def log_out(request):
    logout(request)
    return HttpResponseRedirect(reverse('mindcardapp:login'))

@login_required
def index(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        request.session['deck'] = id
        return HttpResponseRedirect(reverse('mindcardapp:deck'))
    else:
        decks = Deck.objects.filter(user=request.user)
        return render(request, "mindcardapp/index.html", {'decks': decks, 'rename_deck': RenameDeck()})

@login_required
def create_deck(request):
    if request.method == 'POST':
        form = RenameDeck(request.POST)
        if form.is_valid(): 
            name = form.cleaned_data['name']
            deck = Deck.objects.create(user=request.user, name=name)
            request.session['deck'] = deck.id
        return HttpResponseRedirect(reverse('mindcardapp:deck'))

@login_required
def deck(request):
    current_deck = Deck.objects.get(pk=request.session['deck'])
    next_card = ((Card.objects.filter(deck=current_deck)).count()) + 1
    if request.method == 'POST':
        front = request.POST.get('front')
        back = request.POST.get('back')
        response_data = {}

        new_card = Card(deck=current_deck, front=front, back=back, order=next_card)
        new_card.save()

        current_deck.modified = timezone.now()
        current_deck.save()

        response_data['front'] = new_card.front
        response_data['back'] = new_card.back
        response_data['order'] = new_card.order

        next_card += 1

        return JsonResponse(response_data)
    else:
        cards = Card.objects.filter(deck=current_deck).order_by('order')
        return render(request, 'mindcardapp/deck.html', {'cards': cards, 'add_card': AddCard(), 'edit_card': EditCard(), 'delete_card': DeleteCard(), 'rename_deck':RenameDeck(), 'real_rename_deck':RenameDeck(initial={'name': current_deck.name}), 'next_card': next_card, 'current_deck': current_deck, 'delete_deck': DeleteDeck(initial={'id': current_deck.id})})

@login_required
def edit_card(request):
    if request.method == 'POST':
        current_deck = Deck.objects.get(pk=request.session['deck'])
        id = request.POST.get('id')
        new_order = int(request.POST.get('order'))
        front = request.POST.get('front')
        back = request.POST.get('back')

        response_data = {}

        largest = Card.objects.filter(deck=current_deck).count()
        if new_order > largest:
            new_order = largest

        card = Card.objects.get(pk=id)
        current_order = int(card.order)
        if new_order != current_order:
            if new_order > current_order:
                change_order = Card.objects.filter(deck=current_deck, order__range=(current_order + 1, new_order))
                for change in change_order:
                    change.order -= 1
                    change.save()
            else:
                change_order = Card.objects.filter(deck=current_deck, order__range=(new_order, current_order + 1))
                for change in change_order:
                    change.order += 1
                    change.save()

        card.order = new_order
        card.front = front
        card.back = back
        card.save()

        current_deck.modified = timezone.now()
        current_deck.save()
        
        response_data['front'] = int(card.id)
        response_data['front'] = card.front
        response_data['back'] = card.back
        response_data['order'] = int(card.order)
    
        return JsonResponse(response_data)
    else:
        return HttpResponseRedirect(reverse('mindcardapp:deck'))
    
@login_required
def delete_card(request):
    if request.method == 'POST':
        current_deck = Deck.objects.get(pk=request.session['deck'])
        id = request.POST.get('id')
        card = Card.objects.get(pk=id)
        card_order = card.order
        card.delete()
        change_order = Card.objects.filter(deck=current_deck, order__gt=card_order)

        current_deck.modified = timezone.now()
        current_deck.save()

        for change in change_order:
            change.order -= 1
            change.save()
        
        response_data = {}
        return JsonResponse(response_data)
    else:
        return HttpResponseRedirect(reverse('mindcardapp:deck'))

@login_required
def rename_deck(request):
    if request.method == 'POST':
        deck_id = request.POST.get('id')
        name = request.POST.get('name')
        deck = Deck.objects.get(pk=deck_id)
        deck.name = name
        deck.save()

        response_data = {}
        return JsonResponse(response_data)
    else:
        return HttpResponseRedirect(reverse('mindcardapp:deck'))

@login_required
def delete_deck(request):
    if request.method == 'POST':
        deck = Deck.objects.get(pk=request.POST.get('id'))
        cards = Card.objects.filter(deck=deck)
        for card in cards:
            card.delete()
        deck.delete()
        request.session['deck'] = None
    return HttpResponseRedirect(reverse('mindcardapp:index'))

@login_required
def study(request):
    if request.method == 'POST':
        order = request.POST.get('order')
        if order == 'ordered':
            cards = Card.objects.filter(deck__id=request.session['deck']).order_by('order')
        else:
            cards = random.shuffle(Card.objects.filter(deck_id=request.session['deck']))
        
        cards = json.dumps(list(cards))
        return JsonResponse(cards)
    else:
        deck = Deck.objects.get(pk=request.session['deck'])
        cards = Card.objects.filter(deck__id=request.session['deck']).order_by('order').values('id', 'order', 'front', 'back')
        cards_json = json.dumps(list(cards))
        return render(request, 'mindcardapp/study.html', {'study_settings': StudySettings(), 'cards':cards_json, 'deck':deck, 'rename_deck': RenameDeck()})