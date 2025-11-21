import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Crown, User, GraduationCap, UserCog, Key, Check } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  isSystem: boolean;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Partial<Role>) => void;
  role?: Role;
  isEditing?: boolean;
  permissions: Permission[];
}

const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  role,
  isEditing = false,
  permissions
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    permissions: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const roleIcons = [
    { value: 'crown', icon: Crown, label: 'Vương miện' },
    { value: 'shield', icon: Shield, label: 'Khiên' },
    { value: 'user-cog', icon: UserCog, label: 'Quản lý' },
    { value: 'graduation-cap', icon: GraduationCap, label: 'Giáo dục' },
    { value: 'user', icon: User, label: 'Người dùng' }
  ];

  const roleColors = [
    { value: 'red', label: 'Đỏ', class: 'bg-red-500' },
    { value: 'blue', label: 'Xanh dương', class: 'bg-blue-500' },
    { value: 'green', label: 'Xanh lá', class: 'bg-green-500' },
    { value: 'yellow', label: 'Vàng', class: 'bg-yellow-500' },
    { value: 'red', label: 'Đỏ', class: 'bg-red-500' },
    { value: 'gray', label: 'Xám', class: 'bg-gray-500' }
  ];

  useEffect(() => {
    if (role && isEditing) {
      setFormData({
        name: role.name,
        description: role.description,
        color: role.color,
        permissions: [...role.permissions]
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: 'blue',
        permissions: []
      });
    }
    setErrors({});
    
    // Expand all categories by default
    const categories = new Set(permissions.map(p => p.category));
    setExpandedCategories(categories);
  }, [role, isEditing, isOpen, permissions]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên vai trò là bắt buộc';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Tên vai trò phải có ít nhất 2 ký tự';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả vai trò là bắt buộc';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'Phải chọn ít nhất 1 quyền hạn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const roleData: Partial<Role> = {
      name: formData.name,
      description: formData.description,
      color: formData.color,
      permissions: formData.permissions,
      isSystem: false
    };

    onSave(roleData);
    onClose();
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const toggleCategory = (category: string) => {
    const categoryPermissions = permissions
      .filter(p => p.category === category)
      .map(p => p.id);
    
    const allSelected = categoryPermissions.every(id => formData.permissions.includes(id));
    
    if (allSelected) {
      // Deselect all permissions in this category
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !categoryPermissions.includes(id))
      }));
    } else {
      // Select all permissions in this category
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])]
      }));
    }
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên vai trò *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tên vai trò"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex space-x-2">
                  {roleColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.class} border-2 ${
                        formData.color === color.value ? 'border-gray-900' : 'border-gray-300'
                      } hover:border-gray-600 transition-colors`}
                      title={color.label}
                    >
                      {formData.color === color.value && (
                        <Check className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả vai trò *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mô tả về vai trò và trách nhiệm..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Permission Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Phân quyền ({formData.permissions.length}/{permissions.length})
              </h3>
              {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions}</p>}
            </div>

            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                const isExpanded = expandedCategories.has(category);
                const selectedCount = categoryPermissions.filter(p => formData.permissions.includes(p.id)).length;
                const totalCount = categoryPermissions.length;
                const allSelected = selectedCount === totalCount;
                const someSelected = selectedCount > 0 && selectedCount < totalCount;

                return (
                  <div key={category} className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => toggleCategoryExpansion(category)}
                            className="mr-3 text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <h4 className="text-md font-medium text-gray-900">{category}</h4>
                          <span className="ml-2 text-sm text-gray-500">
                            ({selectedCount}/{totalCount})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                            allSelected
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : someSelected
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryPermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                formData.permissions.includes(permission.id)
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => togglePermission(permission.id)}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    formData.permissions.includes(permission.id)
                                      ? 'bg-blue-500 border-blue-500'
                                      : 'border-gray-300'
                                  }`}>
                                    {formData.permissions.includes(permission.id) && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                </div>
                                <div className="ml-3 flex-1">
                                  <h5 className="text-sm font-medium text-gray-900">
                                    {permission.name}
                                  </h5>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {permission.description}
                                  </p>
                                  <code className="text-xs text-gray-500 bg-gray-100 px-1 rounded mt-1 inline-block">
                                    {permission.id}
                                  </code>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Xem trước vai trò</h4>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${formData.color}-100 text-${formData.color}-600`}>
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">
                  {formData.name || 'Tên vai trò'}
                </h5>
                <p className="text-sm text-gray-600">
                  {formData.description || 'Mô tả vai trò'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.permissions.length} quyền hạn được cấp
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Cập nhật vai trò' : 'Tạo vai trò'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
