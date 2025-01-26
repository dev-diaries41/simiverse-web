import { useState, useEffect } from 'react';
import { ActionItem } from '@/app/types';
import { faInfoCircle, faLayerGroup, faExpand, faSlidersH, faEye, faEyeSlash, faLineChart } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '../providers/settings';

const useControlMenu = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { toggleSettings } = useSettings();
  const [isDataPanelVisible, setDataPanelVisible] = useState(false);

  const toggleVisibility = () => {
    setIsMinimized(prevState => !prevState);
  };

  const toggleDataPanel = () => {
    setDataPanelVisible(prev => !prev);
  };

  // Actions for control menu
  const actions: ActionItem[] = [
    {
      icon: faExpand,
      onClick: () => console.log('Fullscreen clicked'),
      name: 'Fullscreen',
    },
    {
      icon: faLineChart,
      onClick: toggleDataPanel,
      name: 'View Data',
    },
    {
      icon: faInfoCircle,
      onClick: () => console.log('Info clicked'),
      name: 'Info',
    },
    {
      icon: faSlidersH,
      onClick: toggleSettings,
      name: 'Settings',
    },
    {
      name: 'Show Controls',
      icon: isMinimized ? faEyeSlash : faEye,
      onClick: toggleVisibility,
    },
  ];

  return {
    actions,
    isMinimized,
    toggleVisibility,
    toggleDataPanel,
    isDataPanelVisible,
  };
};

export default useControlMenu;
