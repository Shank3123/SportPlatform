import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormData = yup.InferType<typeof schema>;

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      onLoginSuccess();
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
        
        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Martial Arts Coach:</strong> coach@martial.com</p>
            <p><strong>Martial Arts User:</strong> user@martial.com</p>
            <p><strong>Coco Coach:</strong> coach@coco.com</p>
            <p><strong>Coco User:</strong> user@coco.com</p>
            <p><strong>Calorie Fight Coach:</strong> coach@calorie.com</p>
            <p><strong>Calorie Fight User:</strong> user@calorie.com</p>
            <p><strong>Expert:</strong> expert@sports.com</p>
            <p className="mt-2 font-medium">Password: any password works</p>
          </div>
        </div>
        
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="Enter your email"
        />

        <div className="mt-4">
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="Enter your password"
          />
        </div>
      </div>

      <Button
        type="submit"
        loading={isLoading}
        className="w-full"
        size="lg"
      >
        Sign In
      </Button>

      <div className="text-center">
        <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
          Forgot your password?
        </a>
      </div>
    </motion.form>
  );
}