import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Save, RotateCcw, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Widget {
  id: string;
  type: string;
  title: string;
  component: React.ReactNode;
}

interface DashboardBuilderProps {
  widgets: Widget[];
  onSaveLayout?: (layout: any) => void;
}

export const DashboardBuilder: React.FC<DashboardBuilderProps> = ({ widgets, onSaveLayout }) => {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [layout, setLayout] = useState<any[]>([]);

  useEffect(() => {
    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem('dashboardLayout');
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      // Default layout
      setLayout(
        widgets.slice(0, 4).map((widget, i) => ({
          i: widget.id,
          x: (i % 2) * 6,
          y: Math.floor(i / 2) * 4,
          w: 6,
          h: 4,
          minW: 3,
          minH: 3,
        }))
      );
    }
    
    if (savedWidgets) {
      setActiveWidgets(JSON.parse(savedWidgets));
    } else {
      setActiveWidgets(widgets.slice(0, 4).map(w => w.id));
    }
  }, []);

  const handleLayoutChange = (newLayout: any[]) => {
    setLayout(newLayout);
  };

  const handleSaveLayout = () => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    localStorage.setItem('dashboardWidgets', JSON.stringify(activeWidgets));
    onSaveLayout?.(layout);
    toast({
      title: "Layout Saved",
      description: "Your dashboard configuration has been saved.",
    });
    setIsEditMode(false);
  };

  const handleResetLayout = () => {
    localStorage.removeItem('dashboardLayout');
    localStorage.removeItem('dashboardWidgets');
    setLayout(
      widgets.slice(0, 4).map((widget, i) => ({
        i: widget.id,
        x: (i % 2) * 6,
        y: Math.floor(i / 2) * 4,
        w: 6,
        h: 4,
        minW: 3,
        minH: 3,
      }))
    );
    setActiveWidgets(widgets.slice(0, 4).map(w => w.id));
    toast({
      title: "Layout Reset",
      description: "Dashboard has been reset to default layout.",
    });
  };

  const handleAddWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      const newActiveWidgets = [...activeWidgets, widgetId];
      setActiveWidgets(newActiveWidgets);
      
      const newLayout = [...layout, {
        i: widgetId,
        x: (layout.length % 2) * 6,
        y: Math.floor(layout.length / 2) * 4,
        w: 6,
        h: 4,
        minW: 3,
        minH: 3,
      }];
      setLayout(newLayout);
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
    setLayout(layout.filter(item => item.i !== widgetId));
  };

  const activeWidgetComponents = widgets.filter(w => activeWidgets.includes(w.id));
  const availableWidgets = widgets.filter(w => !activeWidgets.includes(w.id));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isEditMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {isEditMode ? 'Exit Edit Mode' : 'Edit Dashboard'}
          </button>
          
          {isEditMode && (
            <>
              <button
                onClick={handleSaveLayout}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Layout
              </button>
              
              <button
                onClick={handleResetLayout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </>
          )}
        </div>

        {isEditMode && availableWidgets.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">Add Widget:</span>
            {availableWidgets.map(widget => (
              <button
                key={widget.id}
                onClick={() => handleAddWidget(widget.id)}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors flex items-center gap-1 text-sm"
              >
                <Plus size={14} />
                {widget.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={80}
        width={1200}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
      >
        {activeWidgetComponents.map(widget => (
          <div key={widget.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className={`flex justify-between items-center p-3 bg-gray-800 border-b border-gray-700 ${isEditMode ? 'drag-handle cursor-move' : ''}`}>
              <h3 className="font-semibold text-white">{widget.title}</h3>
              {isEditMode && (
                <button
                  onClick={() => handleRemoveWidget(widget.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="p-4 overflow-auto h-[calc(100%-56px)]">
              {widget.component}
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};