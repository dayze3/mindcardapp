from django import forms

class Register(forms.Form):
    email = forms.EmailField(max_length=30, 
                            widget= forms.EmailInput
                           (attrs={'id':'register_email', 'placeholder':'Email'}),
                           label='')
    username = forms.CharField(max_length=30,
                            widget= forms.TextInput
                           (attrs={'id':'register_username', 'placeholder':'Username'}),
                           label='')
    password = forms.CharField(max_length=30,
                            widget=forms.PasswordInput
                           (attrs={'id':'register_password', 'placeholder':'Password'}),
                           label='')
    confirm_password = forms.CharField(max_length=30,
                            widget=forms.PasswordInput
                           (attrs={'id':'register_confirm', 'placeholder':'Confirm Password'}),
                           label='')
class LogIn(forms.Form):
    username = forms.CharField(max_length=30,
                            widget=forms.TextInput
                           (attrs={'id':'login_username', 'placeholder':'Username'}),
                           error_messages = {
                           'required':'Missing username'},
                           label='')
    password = forms.CharField(max_length=30,
                            widget=forms.PasswordInput
                           (attrs={'id':'login_password', 'placeholder':'Password'}),
                           error_messages = {
                           'required':'Missing password'},
                           label='')
class AddCard(forms.Form):
    front = forms.CharField(widget= forms.Textarea
                           (attrs={'id':'add_card_front', 'class': 'input card-input', 'placeholder': 'Front'}), 
                           required=True, label='')
    back = forms.CharField(widget= forms.Textarea
                          (attrs={'id':'add_card_back', 'class': 'input card-input', 'placeholder': 'Back'}), 
                          required=True, label='')

class EditCard(forms.Form):
    id = forms.IntegerField(widget=forms.HiddenInput
                            (attrs={'id' : 'edit_card_id'}), 
                            required=True, min_value=0)
    order = forms.IntegerField(widget=forms.NumberInput
                              (attrs={'id':'edit_card_order', 'placeholder': 'order (optional)'}), 
                              required=False, min_value=1, label='')
    front = forms.CharField(widget= forms.Textarea
                           (attrs={'id':'edit_card_front', 'class': 'input card-input', 'placeholder': 'Front'}), 
                           required=True, label='')
    back = forms.CharField(widget= forms.Textarea
                          (attrs={'id':'edit_card_back', 'class': 'input card-input', 'placeholder': 'Back'}), 
                          required=True, label='')

class DeleteCard(forms.Form):
    id = forms.IntegerField(widget=forms.HiddenInput
                            (attrs={'id' : 'delete_card_id'}),
                            required=True, min_value=0)

class RenameDeck(forms.Form):
    name = forms.CharField(widget=forms.TextInput
                            (attrs={'id' : 'deck_name', 'class': 'input', 'placeholder': 'Name'}),
                            required=True, label='')
class DeleteDeck(forms.Form):
    id = forms.IntegerField(widget=forms.HiddenInput
                            (attrs={'id' : 'delete_deck_id'}),
                            required=True, min_value=0)
class StudySettings(forms.Form):
    order = forms.ChoiceField(widget=forms.Select
                            (attrs={'id' : 'study_order'}),
                            choices=[('ordered','ordered'), ('random','random')], label='Order')
    start = forms.ChoiceField(widget=forms.Select
                            (attrs={'id' : 'study_start'}),
                            choices=[('front','front'), ('back','back')], label='Start with')