import { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Dialog } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { 
  Loader, 
  PromptMessage, 
  TextButton, 
  ConfirmDialog,
  SearchField,
} from '../../components/Common';
import { LecturerForm } from '../../components/Admin';
import { LecturerTable } from '../../components/Admin';
import { useLecturerManagement } from '../../hooks/features'
import { usePagination, useSorting } from '../../hooks/common';
import { useMessageContext } from '../../contexts/MessageContext';