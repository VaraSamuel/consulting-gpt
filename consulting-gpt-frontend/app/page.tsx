'use client';

import TechnologyForm from './components/forms/technology-form';

export interface FormData {
  name: string;
  abstract: string;
  number_of_related_patents: string;
  number_of_related_papers: string;
  num_of_axes: string;
}

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Health Technology Assessment (HTA)
          </h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to generate your comprehensive commercial viability report
          </p>
        </div>
        <TechnologyForm />
      </div>
    </div>
  );
};

export default Index;
