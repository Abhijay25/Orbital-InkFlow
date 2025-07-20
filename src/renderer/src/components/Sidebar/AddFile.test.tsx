import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddFile from './AddFile';
beforeAll(() => {
  window.electronAPI = {
    saveFile: jest.fn().mockResolvedValue(undefined),
    saveContentToFile: jest.fn().mockResolvedValue(undefined),
    getLatestContentByFile: jest.fn().mockResolvedValue(null),
    getFiles: jest.fn().mockResolvedValue([]),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    transcription: {
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      onUpdate: jest.fn(),
      removeUpdateListener: jest.fn(),
      getTranscript: jest.fn().mockReturnValue(''),
    },
  };
});

test('calls onSave when ADD button is clicked', async () => {
  const onSave = jest.fn();
  const editorRef = { current: null };
  render(<AddFile onSave={onSave} editorRef={editorRef} />);

  fireEvent.click(screen.getByTestId('add-file-icon'));
  await userEvent.type(screen.getByTestId('add-file-text'), 'Test Note');
  await userEvent.click(screen.getByTestId('add-file-button'));

  await waitFor(() => {
    expect(onSave).toHaveBeenCalled();
  });
});