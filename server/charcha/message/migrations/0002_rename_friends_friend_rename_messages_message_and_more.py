# Generated by Django 5.1.1 on 2024-10-14 05:00

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("message", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name="Friends",
            new_name="Friend",
        ),
        migrations.RenameModel(
            old_name="Messages",
            new_name="Message",
        ),
        migrations.RenameModel(
            old_name="Rooms",
            new_name="Room",
        ),
    ]
