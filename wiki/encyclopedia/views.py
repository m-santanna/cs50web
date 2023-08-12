from django.shortcuts import render
from django.http import HttpResponseNotFound, HttpResponseRedirect, HttpResponseBadRequest
from . import util
from django import forms
from random import randint
import markdown2

class Search(forms.Form):
    searchbar = forms.CharField(widget=forms.TextInput(attrs={'class' : 'search', 'placeholder': 'Search'}))

class CreateTitle(forms.Form):
    create_title = forms.CharField(widget=forms.TextInput(attrs={'help_text':'New Wiki Title', 'placeholder': 'Title'}))

class TextArea(forms.Form):
    text = forms.CharField(widget=forms.Textarea(attrs={"cols":"100", "rows":"40"})) 


def index(request):

    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "searchbar":Search()
    })

def wiki(request, wiki):
    #markdowner = markdown2.Markdown()
    #page = util.get_entry(wiki)
    #page_done = markdowner.convert(page) 
    if util.get_entry(wiki):
        for entry in util.list_entries():
            if wiki.lower() == entry.lower():
                wiki = entry
        return render(request, 'encyclopedia/wiki.html', {
            "wiki":wiki,
            "content":util.get_entry(wiki),
            "searchbar":Search()
        })
    else: return HttpResponseNotFound()

def search(request):
    strings = []
    if request.method == 'POST':
        form = Search(request.POST)
        if form.is_valid():
            substring = form.cleaned_data["searchbar"].lower()
 
            for entry in util.list_entries():
                if substring == entry.lower():
                    return HttpResponseRedirect(f'wiki/{entry}')
                
                elif substring in entry.lower():
                    strings.append(entry)
            return render(request, 'encyclopedia/search.html', {
                "strings":strings,
                "searchbar":Search()
            })
    else:
        return render(request, 'encyclopedia/search.html', {
            "strings":strings,
            "searchbar":Search()
        })

def create(request):
    if request.method == 'POST':
        formText = TextArea(request.POST)
        formTitle = CreateTitle(request.POST)
        if formText.is_valid() and formTitle.is_valid():
            title = formTitle.cleaned_data["create_title"]
            text = formText.cleaned_data["text"]
            for entry in util.list_entries():
                if title.lower() == entry.lower():
                    response = HttpResponseBadRequest()
                    response.write("<div style='text-align:center; font-size:70px; margin-top:20%;'>That page already exists! You should try editing instead.</div>")
                    return response
            util.save_entry(title, text)
            return HttpResponseRedirect(f'/wiki/{title}')
    return render(request, 'encyclopedia/create.html', {
        "text":TextArea(),
        "create_title":CreateTitle()
    })

def random(request):
    size = randint(1, len(util.list_entries()) - 1)
    return wiki(request, util.list_entries()[size])


def edit(request, wiki):
    if request.method == "GET":
        for entry in util.list_entries():
            if entry.lower() == wiki.lower():
                print(wiki, entry, util.get_entry(entry))
                return render(request, 'encyclopedia/edit.html', {
                    "wikiTitle":entry,
                    "wikiContent":util.get_entry(entry)
                })