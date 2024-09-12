from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import ProfileImg, Friend, Status

# Define an inline admin descriptor for ProfileImg model
# which acts a bit like a singleton
class ProfileImgInline(admin.StackedInline):
    model = ProfileImg
    can_delete = False
    verbose_name_plural = 'profile images'

class StatusInline(admin.StackedInline):
    model = Status
    can_delete = False
    verbose_name_plural = 'status'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileImgInline, StatusInline)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(ProfileImg)
class ProfileImgAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'picture')

@admin.register(Friend)
class FriendAdmin(admin.ModelAdmin):
	list_display = ('user', 'friend', 'confirmed')

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
	list_display = ('user', 'state', 'date')
