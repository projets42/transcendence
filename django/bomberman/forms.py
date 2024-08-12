from django import forms


class ColorForm(forms.Form):
    colors = [('white', 'white'), ('black', 'black'), ('red', 'red'), ('green', 'green'), ('blue', 'blue'), ('yellow', 'yellow')]
    color1 = forms.ChoiceField(label = "Player 1 :", widget = forms.RadioSelect, choices = colors)
    color2 = forms.ChoiceField(label = "Player 2 :", widget = forms.RadioSelect, choices = colors)