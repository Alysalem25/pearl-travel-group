'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Trash2, 
  Lock, 
  Save, 
  X, 
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  ArrowLeft,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  _id: string
  name: string
  email: string
  number: string
  role: string
  inTeam: boolean
  roleInTeam?: string
  images: string[]
  createdAt: string
  updatedAt: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser, isAuthenticated, loading: authLoading, logout } = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const userId = params.id as string
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Check if user can view this profile
  const isOwnProfile = currentUser?.id === userId
  const isAdmin = currentUser?.role === 'admin'
  const canView = isOwnProfile || isAdmin

  // Redirect if not authorized to view this profile
  useEffect(() => {
    if (!authLoading && isAuthenticated && !canView) {
      // If trying to view someone else's profile but not admin, redirect to own profile
      if (currentUser?.id) {
        router.push(`/profile/${currentUser.id}`)
      } else {
        router.push('/')
      }
    }
  }, [authLoading, isAuthenticated, canView, currentUser, router, userId])

  // Local state
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info')
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    inTeam: false,
    roleInTeam: ''
  })

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordForm>>({})

  // Fetch user profile
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const response = await api.users.getProfile(userId)
      return response.data.user as UserProfile
    },
    enabled: !!userId && !authLoading && isAuthenticated && canView
  })

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return api.users.updateProfile(userId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setIsEditing(false)
      setPreviewImages([])
      setNewImageFiles([])
      alert('Profile updated successfully!')
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to update profile')
    }
  })

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (imageName: string) => {
      return api.users.deleteImage(userId, imageName)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to delete image')
    }
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return api.users.changePassword(userId, data)
    },
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      alert('Password changed successfully!')
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to change password')
    }
  })

  // Initialize form data when profile loads
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        number: profileData.number || '',
        inTeam: profileData.inTeam || false,
        roleInTeam: profileData.roleInTeam || ''
      })
    }
  }, [profileData])

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const totalImages = (profileData?.images?.length || 0) + newImageFiles.length + files.length
    if (totalImages > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...newPreviews])
    setNewImageFiles(prev => [...prev, ...files])
  }

  const removePreviewImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = new FormData()
    submitData.append('name', formData.name)
    submitData.append('email', formData.email)
    submitData.append('number', formData.number)
    submitData.append('inTeam', String(formData.inTeam))
    submitData.append('roleInTeam', formData.roleInTeam)

    newImageFiles.forEach(file => {
      submitData.append('images', file)
    })

    await updateMutation.mutateAsync(submitData)
  }

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Partial<PasswordForm> = {}

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required'
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters'
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    await changePasswordMutation.mutateAsync({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
  }

  // Delete existing image
  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    const imageName = imageUrl.split('/').pop()
    if (imageName) {
      await deleteImageMutation.mutateAsync(imageName)
    }
  }

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false)
    setPreviewImages([])
    setNewImageFiles([])
    if (profileData) {
      setFormData({
        name: profileData.name,
        email: profileData.email,
        number: profileData.number,
        inTeam: profileData.inTeam,
        roleInTeam: profileData.roleInTeam || ''
      })
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Show loading while fetching profile
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading profile</h2>
          <p className="text-gray-600">{(error as any)?.response?.data?.error || 'Something went wrong'}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!profileData || !canView) return null

  const canEdit = isOwnProfile || isAdmin

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
          <div className="px-6 pb-6">
            <div className="relative flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-4 gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                  {profileData.images && profileData.images.length > 0 ? (
                    <img
                      src={`${profileData.images[0]}`}
                      alt={profileData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                {canEdit && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* User Info Header */}
              <div className="flex-1 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {canEdit && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                {isOwnProfile && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mt-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Information
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'security'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Security
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'info' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.number}
                      onChange={e => setFormData({ ...formData, number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Role (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Shield className="w-4 h-4 inline mr-2" />
                      Role
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profileData.role}
                      className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contact admin to change role</p>
                  </div>
                </div>

                {/* Team Section */}
                <div className="border-t border-gray-200 pt-6">
                  <label className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={formData.inTeam}
                      onChange={e => setFormData({ ...formData, inTeam: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Member of Team
                    </span>
                  </label>

                  {formData.inTeam && (
                    <div className="ml-8">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role in Team
                      </label>
                      <input
                        type="text"
                        value={formData.roleInTeam}
                        onChange={e => setFormData({ ...formData, roleInTeam: e.target.value })}
                        placeholder="e.g., Developer, Designer, Manager"
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Images Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Images</h3>
                  
                  {/* Existing Images */}
                  {profileData.images && profileData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {profileData.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img
                            src={`${img}`}
                            alt={`Profile ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img)}
                            disabled={deleteImageMutation.isPending}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {previewImages.map((src, idx) => (
                        <div key={`preview-${idx}`} className="relative aspect-square">
                          <img
                            src={src}
                            alt={`New ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-blue-500 border-dashed"
                          />
                          <button
                            type="button"
                            onClick={() => removePreviewImage(idx)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            New
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Image Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Add Images
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum 5 images. First image will be used as profile picture.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{profileData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{profileData.number}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profileData.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {profileData.role}
                      </span>
                    </div>
                  </div>
                </div>

                {profileData.inTeam && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-blue-600">Team Member</p>
                      <p className="font-medium text-blue-900">{profileData.roleInTeam || 'Team Member'}</p>
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {profileData.images && profileData.images.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {profileData.images.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={`${img}`}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
                  <p>Member since {new Date(profileData.createdAt).toLocaleDateString()}</p>
                  <p>Last updated {new Date(profileData.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Security Tab */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h2>

            <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => {
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    setPasswordErrors({ ...passwordErrors, currentPassword: undefined })
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => {
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    setPasswordErrors({ ...passwordErrors, newPassword: undefined })
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {passwordErrors.newPassword}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => {
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    setPasswordErrors({ ...passwordErrors, confirmPassword: undefined })
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}