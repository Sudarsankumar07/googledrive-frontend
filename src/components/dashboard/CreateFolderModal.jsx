import { useState } from 'react';
import { Formik, Form } from 'formik';
import { FolderPlus, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useFiles } from '../../context/FileContext';
import folderService from '../../services/folderService';
import * as Yup from 'yup';

const folderSchema = Yup.object().shape({
  name: Yup.string()
    .required('Folder name is required')
    .min(1, 'Folder name must be at least 1 character')
    .max(100, 'Folder name must be less than 100 characters')
    .matches(/^[^<>:"/\\|?*]+$/, 'Folder name contains invalid characters')
});

const CreateFolderModal = ({ isOpen, onClose }) => {
  const { currentFolder, refreshFiles } = useFiles();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await folderService.createFolder(values.name, currentFolder?._id || null);
      
      if (result.success) {
        toast.success(`Folder "${values.name}" created!`);
        resetForm();
        onClose();
        refreshFiles();
      } else {
        toast.error(result.message || 'Failed to create folder');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create new folder" size="sm">
      <Formik
        initialValues={{ name: '' }}
        validationSchema={folderSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
          <Form className="space-y-6">
            <Input
              label="Folder name"
              name="name"
              placeholder="My Documents"
              icon={FolderPlus}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              autoFocus
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create folder'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateFolderModal;
