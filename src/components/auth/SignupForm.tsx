import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { User, Shield, Trophy } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  fullName: yup.string().required('Full name is required'),
  role: yup.string().oneOf(['user', 'coach']).required('Role is required'),
  sportsCategory: yup.string().oneOf(['coco', 'martial-arts', 'calorie-fight']).required('Sports category is required'),
});

type SignupFormData = yup.InferType<typeof schema>;

interface SignupFormProps {
  onSignupSuccess: () => void;
}

export function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const [selectedRole, setSelectedRole] = useState<'user' | 'coach'>('user');
  const { register: registerUser, isLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
    defaultValues: { role: 'user' },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await registerUser(data);
      toast.success('Registration successful! Please upload your documents for verification.');
      onSignupSuccess();
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleRoleSelect = (role: 'user' | 'coach') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Join SportsFeed</h2>
        
        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect('user')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === 'user'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">User</h3>
                  <p className="text-sm text-gray-600">Follow coaches and interact</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect('coach')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === 'coach'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Coach</h3>
                  <p className="text-sm text-gray-600">Create content and teach</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sports Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sports Category
          </label>
          <select
            {...register('sportsCategory')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="coco">Coco</option>
            <option value="martial-arts">Martial Arts</option>
            <option value="calorie-fight">Calorie Fight</option>
          </select>
          {errors.sportsCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.sportsCategory.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            {...register('fullName')}
            error={errors.fullName?.message}
            placeholder="Enter your full name"
          />
          
          <Input
            label="Username"
            {...register('username')}
            error={errors.username?.message}
            placeholder="Choose a username"
          />
        </div>

        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="Create a password"
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          placeholder="Confirm your password"
        />

        <input type="hidden" {...register('role')} />
      </div>

      <Button
        type="submit"
        loading={isLoading}
        className="w-full"
        size="lg"
      >
        Create Account
      </Button>

      <p className="text-sm text-gray-600 text-center">
        After registration, you'll need to upload verification documents for expert review.
      </p>
    </motion.form>
  );
}