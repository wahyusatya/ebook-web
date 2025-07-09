"""Store the config"""
from datetime import timedelta
import os
import dataclasses


@dataclasses.dataclass
class Config:
    """Load the configuration key SECRET and JWT_SECRET """
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'supersecretjwtkey')
    # FIXED: Proper timedelta configuration
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', '3600')))
    
    # Database configuration (add if needed)
    DATABASE_HOST = os.getenv('DATABASE_HOST', 'localhost')
    DATABASE_USER = os.getenv('DATABASE_USER', 'root')
    DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', '')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'your_database_name')
    DATABASE_PORT = int(os.getenv('DATABASE_PORT', '3306'))


# Create instance for import
config = Config()