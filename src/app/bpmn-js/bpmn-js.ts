// import _Modeler from 'bpmn-js/lib/Modeler.js';
import * as _Modeler from "bpmn-js/dist/bpmn-modeler.development.js";
import * as _PropertiesPanelModule from 'bpmn-js-properties-panel';
import * as _BpmnPropertiesProvider from 'bpmn-js-properties-panel';
import * as _EntryFactory from 'bpmn-js-properties-panel';
import _PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';

export const InjectionNames = {
  eventBus: 'eventBus',
  bpmnFactory: 'bpmnFactory',
  elementRegistry: 'elementRegistry',
  translate: 'translate',
  propertiesProvider: 'propertiesProvider',
  bpmnPropertiesProvider: 'bpmnPropertiesProvider',
  paletteProvider: 'paletteProvider',
  originalPaletteProvider: 'originalPaletteProvider',
};

export const Modeler = _Modeler;
export const PropertiesPanelModule = _PropertiesPanelModule;
export const EntryFactory = _EntryFactory;
export const OriginalPaletteProvider = _PaletteProvider;
export const OriginalPropertiesProvider = _BpmnPropertiesProvider;

export interface IPaletteProvider {
  getPaletteEntries(): any;
}

export interface IPalette {
  registerProvider(provider: IPaletteProvider): any;
}

export interface IPropertiesProvider {
  getTabs(elemnt): any;
}
