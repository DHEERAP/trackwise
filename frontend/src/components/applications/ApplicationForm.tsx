'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  APPLICATION_STATUS, APPLICATION_PRIORITY, APPLICATION_PLATFORM,
} from '@/constants';
import { toInputDate } from '@/utils/date.utils';
import type { Application, ApplicationFormData } from '@/types';

const schema = z.object({
  company: z.string().min(1, 'Company is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  location: z.string().max(100).optional(),
  salary: z.string().max(50).optional(),
  jobUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  platform: z.enum(APPLICATION_PLATFORM).optional(),
  recruiterName: z.string().max(100).optional(),
  recruiterEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  appliedDate: z.string().optional(),
  interviewDate: z.string().optional(),
  followUpDate: z.string().optional(),
  status: z.enum(APPLICATION_STATUS).optional(),
  priority: z.enum(APPLICATION_PRIORITY).optional(),
  resumeVersion: z.string().max(50).optional(),
  notes: z.string().max(5000).optional(),
});

type FormData = z.infer<typeof schema>;

interface ApplicationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  defaultValues?: Application;
  isSubmitting?: boolean;
}

export const ApplicationForm = ({
  open, onClose, onSubmit, defaultValues, isSubmitting,
}: ApplicationFormProps) => {
  const isEdit = !!defaultValues;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset(
        defaultValues
          ? {
              ...defaultValues,
              appliedDate: toInputDate(defaultValues.appliedDate),
              interviewDate: toInputDate(defaultValues.interviewDate),
              followUpDate: toInputDate(defaultValues.followUpDate),
            }
          : { status: 'Applied', priority: 'Medium' }
      );
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = async (data: FormData) => {
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== undefined)
    ) as ApplicationFormData;
    await onSubmit(cleaned);
    onClose();
  };

  const SelectField = ({
    name, label, options, placeholder,
  }: {
    name: keyof FormData;
    label: string;
    options: readonly string[];
    placeholder: string;
  }) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select
        value={watch(name) as string ?? ''}
        onValueChange={(v) => setValue(name, v as never)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Application' : 'New Application'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Core */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company *</Label>
              <Input id="company" placeholder="Google" {...register('company')} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role *</Label>
              <Input id="role" placeholder="Software Engineer" {...register('role')} />
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Remote / New York" {...register('location')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" placeholder="$120,000 / year" {...register('salary')} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input id="jobUrl" placeholder="https://..." {...register('jobUrl')} />
              {errors.jobUrl && <p className="text-xs text-destructive">{errors.jobUrl.message}</p>}
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField name="status" label="Status" options={APPLICATION_STATUS} placeholder="Select status" />
            <SelectField name="priority" label="Priority" options={APPLICATION_PRIORITY} placeholder="Select priority" />
            <SelectField name="platform" label="Platform" options={APPLICATION_PLATFORM} placeholder="Select platform" />
          </div>

          {/* Recruiter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="recruiterName">Recruiter Name</Label>
              <Input id="recruiterName" placeholder="Jane Doe" {...register('recruiterName')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="recruiterEmail">Recruiter Email</Label>
              <Input id="recruiterEmail" type="email" placeholder="recruiter@company.com" {...register('recruiterEmail')} />
              {errors.recruiterEmail && <p className="text-xs text-destructive">{errors.recruiterEmail.message}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="appliedDate">Applied Date</Label>
              <Input id="appliedDate" type="date" {...register('appliedDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="interviewDate">Interview Date</Label>
              <Input id="interviewDate" type="date" {...register('interviewDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input id="followUpDate" type="date" {...register('followUpDate')} />
            </div>
          </div>

          {/* Resume & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="resumeVersion">Resume Version</Label>
              <Input id="resumeVersion" placeholder="v3-senior-fe" {...register('resumeVersion')} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Interview prep notes, key contacts, impressions..."
              className="min-h-[100px]"
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
