import { useState } from 'react';
import { Formik, Form } from 'formik';
import { Edit2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useFiles } from '../../context/FileContext';
import fileService from '../../services/fileService';
import folderService from '../../services/folderService';
import * as Yup from 'yup';

const renameSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must be at least 1 character')
    .max(255, 'Name must be less than 255 characters')
    .matches(/^[^<>:"/\\|?*]+$/, 'Name contains invalid characters')
});

const RenameModal = ({ isOpen, onClose, item, type }) => {
  const { refreshFiles } = useFiles();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let result;
      if (type === 'file') {
        result = await fileService.renameFile(item._id, values.name);
      } else {
        result = await folderService.renameFolder(item._id, values.name);
      }

      if (result.success) {
        toast.success(`${type === 'file' ? 'File' : 'Folder'} renamed successfully!`);
        onClose();
        refreshFiles();
      } else {
        toast.error(result.message || 'Failed to rename');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rename ${type}`} size="sm">
      <Formik
        initialValues={{ name: item?.name || '' }}
        validationSchema={renameSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
          <Form className="space-y-6">
            <Input
              label="New name"
              name="name"
              placeholder={type === 'file' ? 'document.pdf' : 'My Folder'}
              icon={Edit2}
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
                    Renaming...
                  </>
                ) : (
                  'Rename'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameModal;
