import TechnologyForm from '@/app/components/forms/technology-form';

export default function NewTechnologyPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">New Technology Assessment</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter the details of the technology you want to assess using shadcn/ui.
        </p>
      </div>
      <TechnologyForm />
    </div>
  );
}
