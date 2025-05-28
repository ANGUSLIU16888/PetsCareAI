import { renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from './SettingsContext'; // Assuming SettingsContext.jsx is in the same folder
import { describe, it, expect } from 'vitest';

describe('SettingsContext', () => {
  it('should provide initial settings values', () => {
    const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });
    expect(result.current.detailMessage).toBe("This is the default detail message. Editors can change this!");
    expect(result.current.isSpecialFeatureEnabled).toBe(false);
  });

  it('should update detailMessage when updateDetailMessage is called', () => {
    const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });
    const newMessage = "New detail message from test";

    act(() => {
      result.current.updateDetailMessage(newMessage);
    });

    expect(result.current.detailMessage).toBe(newMessage);
  });

  it('should toggle isSpecialFeatureEnabled when toggleSpecialFeature is called', () => {
    const { result } = renderHook(() => useSettings(), { wrapper: SettingsProvider });

    // Initial state should be false (as per default)
    expect(result.current.isSpecialFeatureEnabled).toBe(false);

    // First toggle
    act(() => {
      result.current.toggleSpecialFeature();
    });
    expect(result.current.isSpecialFeatureEnabled).toBe(true);

    // Second toggle
    act(() => {
      result.current.toggleSpecialFeature();
    });
    expect(result.current.isSpecialFeatureEnabled).toBe(false);
  });
});
