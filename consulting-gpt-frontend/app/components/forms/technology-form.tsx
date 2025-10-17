'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Mail, Notebook } from 'lucide-react';
import { FormData } from '@/app/page';
import { TechnologySchema } from '@/schemas';
import axios from 'axios';
import { FormError } from './form-error';
import { FormSuccess } from './form-success';
import LightBulbIcon from '@heroicons/react/24/outline/LightBulbIcon';
import ScaleIcon from '@heroicons/react/24/outline/ScaleIcon';

const TechnologyForm = () => {
  const router = useRouter();
  const [isPending] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm<FormData>({
    resolver: zodResolver(TechnologySchema),
    defaultValues: {
      name: '',
      abstract: '',
      number_of_related_patents: '',
      number_of_related_papers: '',
      num_of_axes: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof TechnologySchema>) => {
    setError('');
    setSuccess('');

    const loadingToastId = toast.loading('Processing your technology submission...');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/technologies`, values);
      toast.success(`Technology "${values.name}" has been submitted for evaluation!.`, {
        id: loadingToastId,
        description: `ID: ${response.data.id}. We'll guide you through the analysis.`,
        duration: 7000,
        action: {
          label: 'View Report',
          onClick: () => router.push(`/technology/${response.data.id}/`),
        },
      });

      form.reset();
      router.push(`/technology/${response.data.id}`);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please review your input and try again.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Submission Error: ${error.response.data.detail || 'Please check the details and try again.'}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error('Oops! Something went wrong.', {
        id: loadingToastId,
        description: errorMessage,
        duration: 7000,
      });
    } finally {
      // cleanup if needed
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl border-0 bg-white/80 shadow-xl backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Technology Information Form
        </CardTitle>
        <CardDescription className="text-gray-600">
          Please provide your technology information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                    <LightBulbIcon className="h-4 w-4" />
                    Technology Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="border-gray-300 transition-colors focus:border-blue-500 focus:ring-blue-500"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                    <Notebook className="h-4 w-4" />
                    Technology Abstract
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your techonogy in detail..."
                      className="min-h-[120px] resize-none border-gray-300 transition-colors focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number_of_related_patents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                    <Briefcase className="h-4 w-4" />
                    Number of Related Patents
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the number of related patents"
                      {...field}
                      className="border-gray-300 transition-colors focus:border-blue-500 focus:ring-blue-500"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number_of_related_papers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                    <Mail className="h-4 w-4" />
                    Number of Related Papers
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the number of related papers"
                      {...field}
                      className="border-gray-300 transition-colors focus:border-blue-500 focus:ring-blue-500"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="num_of_axes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                    <ScaleIcon className="h-4 w-4" />
                    Number of Axes
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the number of axes (1-5)"
                      {...field}
                      className="border-gray-300 transition-colors focus:border-blue-500 focus:ring-blue-500"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button
              type="submit"
              className="w-full transform bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
              disabled={isPending}
            >
              Generate Report
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TechnologyForm;
