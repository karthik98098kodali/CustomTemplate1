import { AfterContentInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/map';

import ConnectorsExtensionModule from 'bpmn-js-connectors-extension';
import ZeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';
import ZeebeBehaviorModule from 'camunda-bpmn-js-behaviors/lib/camunda-cloud';

import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json';
// import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
// import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development.js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
          BpmnPropertiesPanelModule, 
          BpmnPropertiesProviderModule
          , CamundaPlatformPropertiesProviderModule,
          ZeebePropertiesProviderModule,
          CloudElementTemplatesPropertiesProviderModule
        } from 'bpmn-js-properties-panel';

import TemplateIconRendererModule from '@bpmn-io/element-templates-icons-renderer';

import * as camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

import AddExporterModule from '@bpmn-io/add-exporter';

import {
  InjectionNames,
  OriginalPaletteProvider
} from "./bpmn-js/bpmn-js";

import * as data from './bpmn-js/http-json-connector.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, AfterContentInit, OnDestroy{

  title = 'wfm_custom_element';
  bpmnModeler: BpmnModeler;
  importDone: any;

 
  TEMPLATES = loadTemplates();
   // retrieve DOM element reference
   @ViewChild('ref', { static: true }) private el: ElementRef | undefined;
  // url = '/assets/bpmn/test.bpmn';

  constructor(private http: HttpClient) { }

  ngOnInit(): void { 
   const url = new URL(window.location.href);

   const appendAnything = url.searchParams.has('aa');
   console.log('afafasfsadfs>>>>>>>>>>>>>       '+appendAnything);
   this.bpmnModeler = new BpmnModeler({
      container: '#js-canvas',      
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      exporter: {
        name: 'connectors-modeling-demo',
        version: '0.0.0'
      },
      keyboard: { bindTo: document },
      connectorsExtension: {
        appendAnything
      },
      additionalModules: [
        AddExporterModule,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        // CamundaPlatformPropertiesProviderModule,
        ConnectorsExtensionModule,
        TemplateIconRendererModule,
        ZeebeBehaviorModule,
        ZeebePropertiesProviderModule,
        CloudElementTemplatesPropertiesProviderModule,
        
        {[InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider]},
      ],
      moddleExtensions: {
        // camunda: CamundaBpmnModdle,
        zeebe: ZeebeModdle
      }
    }); 

    this.bpmnModeler.get('connectorsExtension').loadTemplates(this.TEMPLATES);
    this.bpmnModeler.get('canvas').zoom('fit-viewport');
   
    this.load();
  }



  ngOnDestroy(): void { }
  ngAfterContentInit(): void {
    this.bpmnModeler.attachTo(this.el?.nativeElement);
   }  

  load(): void {
    const url = '/assets/bpmn/initial.bpmn';
    this.http.get(url, {
      headers: {observe: 'response'}, responseType: 'text'
    }).subscribe(
      (x: any) => {
        // this.bpmnModeler.get('canvas').zoom('fit-viewport');
        console.log('Fetched XML, now importing: ', x);
        this.bpmnModeler.importXML(x, this.handleError);
      },
      this.handleError
    );
  };

  save(): void {
    this.bpmnModeler.saveXML((err: any, xml: any) => console.log('Result of saving XML: ', err, xml));
  }

  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }

}
function loadTemplates() {
  const context = [
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Hey Due Date",
      "id": "a41a12d5-17aa-4860-a349-b3a29371e390",
      "description": "Hey Due Date for Camunda",
      "appliesTo": [
        "bpmn:ServiceTask",
        "bpmn:StartEvent"
      ],
      "documentationRef": "https://github.com/francav/hey-duedate",
      "icon": {
        "contents": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAADaCAYAAADAHVzbAAAACXBIWXMAAC4jAAAuIwF4pT92AAATdklEQVR4nO3dW2xbyXkH8I8XiaRIirrfbFmyJMe7XsteX3Y33k27lzYFWmQTIA/tUx8KBC2SAO1DAvSp6EOAAkmThxZFiyRA0RZo0QuaFuvdYG3D2ew6u5K38a4t+bK2YtmWLFmyZFESRfEiXoo51JGPjs45nCGHE1vn/wMOKEvi0ZDmx2/mm+Ecz6Gx4msEALV02U9E7+EpBqip1714fgFqD4EGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASiAQANQAIEGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASiAQANQAIEGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASiAQANQAIEGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASiAQANQAIEGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASiAQANQAIEGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASiAQANQAIEGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASiAQANQAIEGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASiAQANQAIEGoAACDUABBBqAAgg0AAUQaAAKINAAFECgASjg341Psief02796SRF/R56NlTd+RK5It1M5qjgLT1duWBYuy36avP0GdvPeAu5rZ/1BLzUE/TRbDpPs5mC9r1fd7tOxuoqOl/B46Ob63mK+xu0f9eq3U+C3fvINrEg+dFzsarPs5Yv0ntLG/S9e2mKS2obry93BOjNjgCdaNz5gv75UpZ+Fs/TWwtZpW062einr+9tsGyTiK9dT9Ko2qb/WngOjRWLu+1B+VNr2m3LxC+12796eYhO7d8r5dzJ7Ab98ZUlurW2QanmLu17st6J9YwRis9pt68l79G3XztGnZGGsvedfLRCfzGZVtKuP/AsaO2qVjKbo6/8y7u0ePg3tDNthKt/Q3xCve6KMdrI5Iy0c4Xr6+j7w20U9df2qftSV5j++kuvcAUZM9Aaox8ea9fuV0snmgJSgoz58N5cTdv6JNmVgZavD2pHsqtfO67evS/1/N1BH/2+f0kbq+jjlWqwjMEOljHY8WZ2mv7y2WbhM0b8Xvr2YISObjzSzqOft1r6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"
      },
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:my-connector:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "Calendar",
          "type": "String",
          "binding": {
            "type": "zeebe:input",
            "name": "calendar"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Start Date",
          "type": "String",
          "binding": {
            "type": "zeebe:input",
            "name": "startDate"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "SLA",
          "type": "String",
          "binding": {
            "type": "zeebe:input",
            "name": "sla"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Async before?",
          "type": "Boolean",
          "binding": {
            "type": "property",
            "name": "camunda:asyncBefore"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Dynamic Template (different values)",
      "id": "dynamic-template-different-values",
      "appliesTo": [
        "bpmn:Task"
      ],
      "properties": [
        {
          "id": "operation",
          "label": "operation",
          "description": "Operation to be done",
          "type": "Dropdown",
          "value": "action1",
          "choices": [
            {
              "name": "Action 1",
              "value": "action1"
            },
            {
              "name": "Action 2",
              "value": "action2"
            },
            {
              "name": "Action 3",
              "value": "action3"
            }
          ],
          "binding": {
            "type": "zeebe:input",
            "name": "functionType"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Type",
          "type": "String",
          "value": "action1-value",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          },
          "condition": {
            "property": "operation",
            "equals": "action1"
          }
        },
        {
          "label": "Type",
          "type": "String",
          "value": "action2-value",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          },
          "condition": {
            "property": "operation",
            "equals": "action2"
          }
        },
        {
          "label": "Type",
          "type": "String",
          "value": "action3-value",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          },
          "condition": {
            "property": "operation",
            "equals": "action3"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Empty",
      "id": "example.empty",
      "description": "Empty Template",
      "appliesTo": [
        "bpmn:Task"
      ],
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20width%3D%2218%22%20viewBox%3D%220%200%2010%2010%22%20shape-rendering%3D%22geometricPrecision%22%3E%3Ctitle%3ESlack%3C%2Ftitle%3E%3Cg%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M0%2C0%20L0%2C10%20L10%2C10%20L10%2C0%20z%22%20fill%3D%22%23999999%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
      },
      "properties": []
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "GitHubWebhookTemplate",
      "id": "io.camunda.example.inbound.GitHubWebhook.v1",
      "appliesTo": [
        "bpmn:StartEvent"
      ],
      "groups": [
        {
          "id": "endpoint",
          "label": "Webhook Configuration"
        },
        {
          "id": "activation",
          "label": "Activation"
        },
        {
          "id": "variable-mapping",
          "label": "Variable Mapping"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "webhook",
          "binding": {
            "type": "zeebe:property",
            "name": "inbound.type"
          }
        },
        {
          "type": "Hidden",
          "value": "=get value(request.headers, &#34;x-hub-signature&#34;)",
          "binding": {
            "type": "zeebe:property",
            "name": "inbound.secretExtractor"
          }
        },
        {
          "label": "Path",
          "type": "String",
          "group": "endpoint",
          "binding": {
            "type": "zeebe:property",
            "name": "inbound.context"
          },
          "description": "Context path for this webhook"
        },
        {
          "label": "Secret",
          "type": "String",
          "group": "endpoint",
          "optional": true,
          "binding": {
            "type": "zeebe:property",
            "name": "inbound.secret"
          },
          "description": "Used to verify the payload against"
        },
        {
          "label": "Condition",
          "type": "String",
          "group": "activation",
          "feel": "required",
          "optional": true,
          "binding": {
            "type": "zeebe:property",
            "name": "inbound.activationCondition"
          },
          "description": "Condition under which the connector triggers"
        },
        {
          "label": "Start Variables",
          "type": "String",
          "group": "variable-mapping",
          "feel": "required",
          "binding": {
            "type": "zeebe:property",
            "name": "inbound.variableMapping"
          },
          "description": "Variables extracted from the webhook payload (request) to start the process with"
        }
      ],
      "icon": {
        "contents": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1MHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+CiAgICA8Zz4KICAgICAgICA8cGF0aCBkPSJNMTI4LjAwMTA2LDAgQzU3LjMxNzI5MjYsMCAwLDU3LjMwNjY5NDIgMCwxMjguMDAxMDYgQzAsMTg0LjU1NTI4MSAzNi42NzYxOTk3LDIzMi41MzU1NDIgODcuNTM0OTM3LDI0OS40NjA4OTkgQzkzLjkzMjAyMjMsMjUwLjY0NTc3OSA5Ni4yODA1ODgsMjQ2LjY4NDE2NSA5Ni4yODA1ODgsMjQzLjMwMzMzMyBDOTYuMjgwNTg4LDI0MC4yNTEwNDUgOTYuMTYxODg3OCwyMzAuMTY3ODk5IDk2LjEwNjc3NywyMTkuNDcyMTc2IEM2MC40OTY3NTg1LDIyNy4yMTUyMzUgNTIuOTgyNjIwNywyMDQuMzY5NzEyIDUyLjk4MjYyMDcsMjA0LjM2OTcxMiBDNDcuMTU5OTU4NCwxODkuNTc0NTk4IDM4Ljc3MDQwOCwxODUuNjQwNTM4IDM4Ljc3MDQwOCwxODUuNjQwNTM4IEMyNy4xNTY4Nzg1LDE3Ny42OTYxMTMgMzkuNjQ1ODIwNiwxNzcuODU5MzI1IDM5LjY0NTgyMDYsMTc3Ljg1OTMyNSBDNTIuNDk5MzQxOSwxNzguNzYyMjkzIDU5LjI2NzM2NSwxOTEuMDQ5ODcgNTkuMjY3MzY1LDE5MS4wNDk4NyBDNzAuNjgzNzY3NSwyMTAuNjE4NDIzIDg5LjIxMTU3NTMsMjA0Ljk2MTA5MyA5Ni41MTU4Njg1LDIwMS42OTA0ODIgQzk3LjY2NDcxNTUsMTkzLjQxNzUxMiAxMDAuOTgxOTU5LDE4Ny43NzA3OCAxMDQuNjQyNTgzLDE4NC41NzQzNTcgQzc2LjIxMTc5OSwxODEuMzM3NjYgNDYuMzI0ODE5LDE3MC4zNjIxNDQgNDYuMzI0ODE5LDEyMS4zMTU3MDIgQzQ2LjMyNDgxOSwxMDcuMzQwODg5IDUxLjMyNTA1ODgsOTUuOTIyMzY4MiA1OS41MTMyNDM3LDg2Ljk1ODM5MzcgQzU4LjE4NDIyNjgsODMuNzM0NDE1MiA1My44MDI5MjI5LDcwLjcxNTU2MiA2MC43NTMyMzU0LDUzLjA4NDM2MzYgQzYwLjc1MzIzNTQsNTMuMDg0MzYzNiA3MS41MDE5NTAxLDQ5LjY0NDE4MTMgOTUuOTYyNjQxMiw2Ni4yMDQ5NTk1IEMxMDYuMTcyOTY3LDYzLjM2ODg3NiAxMTcuMTIzMDQ3LDYxLjk0NjU5NDkgMTI4LjAwMTA2LDYxLjg5Nzg0MzIgQzEzOC44NzkwNzMsNjEuOTQ2NTk0OSAxNDkuODM3NjMyLDYzLjM2ODg3NiAxNjAuMDY3MDMzLDY2LjIwNDk1OTUgQzE4NC40OTgwNSw0OS42NDQxODEzIDE5NS4yMzE5MjYsNTMuMDg0MzYzNiAxOTUuMjMxOTI2LDUzLjA4NDM2MzYgQzIwMi4xOTkxOTcsNzAuNzE1NTYyIDE5Ny44MTU3NzMsODMuNzM0NDE1MiAxOTYuNDg2NzU2LDg2Ljk1ODM5MzcgQzIwNC42OTQwMTgsOTUuOTIyMzY4MiAyMDkuNjYwMzQzLDEwNy4zNDA4ODkgMjA5LjY2MDM0MywxMjEuMzE1NzAyIEMyMDkuNjYwMzQzLDE3MC40Nzg3MjUgMTc5LjcxNjEzMywxODEuMzAzNzQ3IDE1MS4yMTMyODEsMTg0LjQ3MjYxNCBDMTU1LjgwNDQzLDE4OC40NDQ4MjggMTU5Ljg5NTM0MiwxOTYuMjM0NTE4IDE1OS44OTUzNDIsMjA4LjE3NjU5MyBDMTU5Ljg5NTM0MiwyMjUuMzAzMzE3IDE1OS43NDY5NjgsMjM5LjA4NzM2MSAxNTkuNzQ2OTY4LDI0My4zMDMzMzMgQzE1OS43NDY5NjgsMjQ2LjcwOTYwMSAxNjIuMDUxMDIsMjUwLjcwMDg5IDE2OC41MzkyNSwyNDkuNDQzOTQxIEMyMTkuMzcwNDMyLDIzMi40OTk1MDcgMjU2LDE4NC41MzYyMDQgMjU2LDEyOC4wMDEwNiBDMjU2LDU3LjMwNjY5NDIgMTk4LjY5MTE4NywwIDEyOC4wMDEwNiwwIFogTTQ3Ljk0MDU1OTMsMTgyLjM0MDIxMiBDNDcuNjU4NjQ2NSwxODIuOTc2MTA1IDQ2LjY1ODE3NDUsMTgzLjE2Njg3MyA0NS43NDY3Mjc3LDE4Mi43MzAyMjcgQzQ0LjgxODMyMzUsMTgyLjMxMjY1NiA0NC4yOTY4OTE0LDE4MS40NDU3MjIgNDQuNTk3ODgwOCwxODAuODA3NzEgQzQ0Ljg3MzQzNDQsMTgwLjE1MjczOSA0NS44NzYwMjYsMTc5Ljk3MDQ1IDQ2LjgwMjMxMDMsMTgwLjQwOTIxNiBDNDcuNzMyODM0MiwxODAuODI2Nzg2IDQ4LjI2Mjc0NTEsMTgxLjcwMjE5OSA0Ny45NDA1NTkzLDE4Mi4zNDAyMTIgWiBNNTQuMjM2Nzg5MiwxODcuOTU4MjU0IEM1My42MjYzMzE4LDE4OC41MjQxOTkgNTIuNDMyOTcyMywxODguMjYxMzYzIDUxLjYyMzI2ODIsMTg3LjM2Njg3NCBDNTAuNzg2MDA4OCwxODYuNDc0NTA0IDUwLjYyOTE1NTMsMTg1LjI4MTE0NCA1MS4yNDgwOTEyLDE4NC43MDY3MiBDNTEuODc3NjI1NCwxODQuMTQwNzc1IDUzLjAzNDk1MTIsMTg0LjQwNTczMSA1My44NzQzMzAyLDE4NS4yOTgxMDEgQzU0LjcxMTU4OTIsMTg2LjIwMTA2OSA1NC44NzQ4MDE5LDE4Ny4zODU5NSA1NC4yMzY3ODkyLDE4Ny45NTgyNTQgWiBNNTguNTU2MjQxMywxOTUuMTQ2MzQ3IEM1Ny43NzE5NzMyLDE5NS42OTEwOTYgNTYuNDg5NTg4NiwxOTUuMTgwMjYxIDU1LjY5Njg0MTcsMTk0LjA0MjAxMyBDNTQuOTEyNTczMywxOTIuOTAzNzY0IDU0LjkxMjU3MzMsMTkxLjUzODcxMyA1NS43MTM3OTksMTkwLjk5MTg0NSBDNTYuNTA4NjY1MSwxOTAuNDQ0OTc3IDU3Ljc3MTk3MzIsMTkwLjkzNjczNSA1OC41NzUzMTgxLDE5Mi4wNjY1MDUgQzU5LjM1NzQ2NjksMTkzLjIyMzgzIDU5LjM1NzQ2NjksMTk0LjU4ODg4IDU4LjU1NjI0MTMsMTk1LjE0NjM0NyBaIE02NS44NjEzNTkyLDIwMy40NzExNzQgQzY1LjE1OTc1NzEsMjA0LjI0NDg0NiA2My42NjU0MDgzLDIwNC4wMzcxMiA2Mi41NzE2NzE3LDIwMi45ODE1MzggQzYxLjQ1MjQ5OTksMjAxLjk0OTI3IDYxLjE0MDkxMjIsMjAwLjQ4NDU5NiA2MS44NDQ2MzQxLDE5OS43MTA5MjYgQzYyLjU1NDcxNDYsMTk4LjkzNTEzNyA2NC4wNTc1NDIyLDE5OS4xNTM0NiA2NS4xNTk3NTcxLDIwMC4yMDA1NjQgQzY2LjI3MDQ1MDYsMjAxLjIzMDcxMiA2Ni42MDk1OTM2LDIwMi43MDU5ODQgNjUuODYxMzU5MiwyMDMuNDcxMTc0IFogTTc1LjMwMjUxNTEsMjA2LjI4MTU0MiBDNzQuOTkzMDQ3NCwyMDcuMjg0MTM0IDczLjU1MzgwOSwyMDcuNzM5ODU3IDcyLjEwMzk3MjQsMjA3LjMxMzgwOSBDNzAuNjU2MjU1NiwyMDYuODc1MDQzIDY5LjcwODc3NDgsMjA1LjcwMDc2MSA3MC4wMDEyODU3LDIwNC42ODc1NzEgQzcwLjMwMjI3NSwyMDMuNjc4NjIxIDcxLjc0Nzg3MjEsMjAzLjIwMzgyIDczLjIwODMwNjksMjAzLjY1OTU0MyBDNzQuNjUzOTA0MSwyMDQuMDk2MTkgNzUuNjAzNTA0OCwyMDUuMjYxOTk0IDc1LjMwMjUxNTEsMjA2LjI4MTU0MiBaIE04Ni4wNDY5NDcsMjA3LjQ3MzYyNyBDODYuMDgyOTgwNiwyMDguNTI5MjA5IDg0Ljg1MzU4NzEsMjA5LjQwNDYyMiA4My4zMzE2ODI5LDIwOS40MjM3IEM4MS44MDEzLDIwOS40NTc2MTQgODAuNTYzNDI4LDIwOC42MDMzOTggODAuNTQ2NDcwOCwyMDcuNTY0NzcyIEM4MC41NDY0NzA4LDIwNi40OTg1OTEgODEuNzQ4MzA4OCwyMDUuNjMxNjU3IDgzLjI3ODY5MTcsMjA1LjYwNjIyMSBDODQuODAwNTk2MiwyMDUuNTc2NTQ2IDg2LjA0Njk0NywyMDYuNDI0NDAzIDg2LjA0Njk0NywyMDcuNDczNjI3IFogTTk2LjYwMjE0NzEsMjA3LjA2OTAyMyBDOTYuNzg0NDM2NiwyMDguMDk5MTcxIDk1LjcyNjczNDEsMjA5LjE1Njg3MiA5NC4yMTU0MjgsMjA5LjQzODc4NSBDOTIuNzI5NTU3NywyMDkuNzEwMDk5IDkxLjM1MzkwODYsMjA5LjA3NDIwNiA5MS4xNjUyNjAzLDIwOC4wNTI1MzggQzkwLjk4MDg1MTUsMjA2Ljk5Njk1NSA5Mi4wNTc2MzA2LDIwNS45MzkyNTMgOTMuNTQxMzgxMywyMDUuNjY1ODIgQzk1LjA1NDgwNywyMDUuNDAyOTg0IDk2LjQwOTI1OTYsMjA2LjAyMTkxOSA5Ni42MDIxNDcxLDIwNy4wNjkwMjMgWiIgZmlsbD0iIzE2MTYxNCI+PC9wYXRoPgogICAgPC9nPgo8L3N2Zz4="
      }
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Header A Task",
      "id": "foop.example.headers.template",
      "description": "A template with task header <a>",
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "properties": [
        {
          "type": "Hidden",
          "value": "foop.example:headers",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "Task Header <a>",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "a"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Input A Task",
      "id": "foop.example.inputs.template",
      "description": "A template with input <a>",
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "properties": [
        {
          "type": "Hidden",
          "value": "foop.example:input",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "Input <a>",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "a"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "REST Connector",
      "id": "io.camunda.connectors.HttpJson.v2",
      "description": "Invoke REST API",
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M17.0335%208.99997C17.0335%2013.4475%2013.4281%2017.0529%208.98065%2017.0529C4.53316%2017.0529%200.927765%2013.4475%200.927765%208.99997C0.927765%204.55248%204.53316%200.947083%208.98065%200.947083C13.4281%200.947083%2017.0335%204.55248%2017.0335%208.99997Z%22%20fill%3D%22%23505562%22%2F%3E%0A%3Cpath%20d%3D%22M4.93126%2014.1571L6.78106%203.71471H10.1375C11.1917%203.71471%2011.9824%203.98323%2012.5095%204.52027C13.0465%205.04736%2013.315%205.73358%2013.315%206.57892C13.315%207.44414%2013.0714%208.15522%2012.5841%208.71215C12.1067%209.25913%2011.4553%209.63705%2010.6298%209.8459L12.0619%2014.1571H10.3315L9.03364%2010.0249H7.24351L6.51254%2014.1571H4.93126ZM7.49711%208.59281H9.24248C9.99832%208.59281%2010.5901%208.42374%2011.0177%208.08561C11.4553%207.73753%2011.6741%207.26513%2011.6741%206.66842C11.6741%206.19106%2011.5249%205.81811%2011.2265%205.54959C10.9282%205.27113%2010.4558%205.1319%209.80936%205.1319H8.10874L7.49711%208.59281Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A"
      },
      "documentationRef": "https://docs.camunda.io/docs/components/modeler/web-modeler/connectors/available-connectors/rest/",
      "category": {
        "id": "connectors",
        "name": "Connectors"
      },
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "groups": [
        {
          "id": "authentication",
          "label": "Authentication"
        },
        {
          "id": "endpoint",
          "label": "HTTP Endpoint"
        },
        {
          "id": "input",
          "label": "Payload"
        },
        {
          "id": "output",
          "label": "Response Mapping"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:http-json:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "Type",
          "id": "authenticationType",
          "group": "authentication",
          "description": "Choose the authentication type. Select 'No Auth' if no authentication is necessary.",
          "value": "noAuth",
          "type": "Dropdown",
          "choices": [
            {
              "name": "No Auth",
              "value": "noAuth"
            },
            {
              "name": "Basic Auth",
              "value": "basic"
            },
            {
              "name": "Bearer Token Auth",
              "value": "bearer"
            }
          ],
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.type"
          }
        },
        {
          "id": "method",
          "label": "Method",
          "group": "endpoint",
          "type": "Dropdown",
          "value": "get",
          "choices": [
            {
              "name": "GET",
              "value": "get"
            },
            {
              "name": "POST",
              "value": "post"
            },
            {
              "name": "PATCH",
              "value": "patch"
            },
            {
              "name": "PUT",
              "value": "put"
            },
            {
              "name": "DELETE",
              "value": "delete"
            }
          ],
          "binding": {
            "type": "zeebe:input",
            "name": "method"
          }
        },
        {
          "label": "URL",
          "group": "endpoint",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "url"
          },
          "constraints": {
            "notEmpty": true,
            "pattern": {
              "value": "^https?://.*",
              "message": "Must be a http(s) URL."
            }
          }
        },
        {
          "label": "Query Parameters",
          "description": "Map of query parameters to add to the request URL",
          "group": "endpoint",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "queryParameters"
          },
          "optional": true
        },
        {
          "label": "HTTP Headers",
          "description": "Map of HTTP headers to add to the request",
          "group": "endpoint",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "headers"
          },
          "optional": true
        },
        {
          "label": "Bearer Token",
          "group": "authentication",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.token"
          },
          "constraints": {
            "notEmpty": true
          },
          "condition": {
            "property": "authenticationType",
            "equals": "bearer"
          }
        },
        {
          "label": "Username",
          "group": "authentication",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.username"
          },
          "constraints": {
            "notEmpty": true
          },
          "condition": {
            "property": "authenticationType",
            "equals": "basic"
          }
        },
        {
          "label": "Password",
          "group": "authentication",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.password"
          },
          "constraints": {
            "notEmpty": true
          },
          "condition": {
            "property": "authenticationType",
            "equals": "basic"
          }
        },
        {
          "label": "Request Body",
          "description": "JSON payload to send with the request",
          "group": "input",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "body"
          },
          "condition": {
            "property": "method",
            "oneOf": [
              "post",
              "put",
              "patch",
              "delete"
            ]
          },
          "optional": true
        },
        {
          "label": "Result Variable",
          "description": "Name of variable to store the response in",
          "group": "output",
          "type": "String",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultVariable"
          }
        },
        {
          "label": "Result Expression",
          "description": "Expression to map the response into process variables",
          "group": "output",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultExpression"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "REST Connector (No Auth)",
      "id": "io.camunda.connectors.HttpJson.v1.noAuth",
      "description": "[Deprecated] Replace with 'REST Connector' template.",
      "documentationRef": "https://docs.camunda.io/docs/components/modeler/web-modeler/connectors/available-connectors/rest/",
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%221%201%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M17.0335%208.99997C17.0335%2013.4475%2013.4281%2017.0529%208.98065%2017.0529C4.53316%2017.0529%200.927765%2013.4475%200.927765%208.99997C0.927765%204.55248%204.53316%200.947083%208.98065%200.947083C13.4281%200.947083%2017.0335%204.55248%2017.0335%208.99997Z%22%20fill%3D%22%23505562%22%2F%3E%0A%3Cpath%20d%3D%22M4.93126%2014.1571L6.78106%203.71471H10.1375C11.1917%203.71471%2011.9824%203.98323%2012.5095%204.52027C13.0465%205.04736%2013.315%205.73358%2013.315%206.57892C13.315%207.44414%2013.0714%208.15522%2012.5841%208.71215C12.1067%209.25913%2011.4553%209.63705%2010.6298%209.8459L12.0619%2014.1571H10.3315L9.03364%2010.0249H7.24351L6.51254%2014.1571H4.93126ZM7.49711%208.59281H9.24248C9.99832%208.59281%2010.5901%208.42374%2011.0177%208.08561C11.4553%207.73753%2011.6741%207.26513%2011.6741%206.66842C11.6741%206.19106%2011.5249%205.81811%2011.2265%205.54959C10.9282%205.27113%2010.4558%205.1319%209.80936%205.1319H8.10874L7.49711%208.59281Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A"
      },
      "category": {
        "id": "connectors",
        "name": "Connectors"
      },
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "groups": [
        {
          "id": "endpoint",
          "label": "HTTP Endpoint"
        },
        {
          "id": "input",
          "label": "Payload"
        },
        {
          "id": "output",
          "label": "Response Mapping"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:http-json:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "Method",
          "group": "endpoint",
          "type": "Dropdown",
          "value": "get",
          "choices": [
            {
              "name": "GET",
              "value": "get"
            },
            {
              "name": "POST",
              "value": "post"
            },
            {
              "name": "PATCH",
              "value": "patch"
            },
            {
              "name": "PUT",
              "value": "put"
            },
            {
              "name": "DELETE",
              "value": "delete"
            }
          ],
          "binding": {
            "type": "zeebe:input",
            "name": "method"
          }
        },
        {
          "label": "URL",
          "group": "endpoint",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "url"
          },
          "constraints": {
            "notEmpty": true,
            "pattern": {
              "value": "^(=|https?://).*",
              "message": "Must be a http(s) URL."
            }
          }
        },
        {
          "label": "Query Parameters",
          "description": "Map of query parameters to add to the request URL",
          "group": "endpoint",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "queryParameters"
          },
          "optional": true
        },
        {
          "label": "HTTP Headers",
          "description": "Map of HTTP headers to add to the request",
          "group": "endpoint",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "headers"
          },
          "optional": true
        },
        {
          "label": "Request Body",
          "description": "JSON payload to send with the request",
          "group": "input",
          "type": "Text",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "body"
          },
          "optional": true
        },
        {
          "label": "Result Variable",
          "description": "Name of variable to store the response in",
          "group": "output",
          "type": "String",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultVariable"
          }
        },
        {
          "label": "Result Expression",
          "description": "Expression to map the response into process variables",
          "group": "output",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultExpression"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "REST Connector (Basic Auth)",
      "id": "io.camunda.connectors.HttpJson.v1.basicAuth",
      "description": "[Deprecated] Replace with 'REST Connector' template.",
      "documentationRef": "https://docs.camunda.io/docs/components/modeler/web-modeler/connectors/available-connectors/rest/",
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%221%201%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M17.0335%208.99997C17.0335%2013.4475%2013.4281%2017.0529%208.98065%2017.0529C4.53316%2017.0529%200.927765%2013.4475%200.927765%208.99997C0.927765%204.55248%204.53316%200.947083%208.98065%200.947083C13.4281%200.947083%2017.0335%204.55248%2017.0335%208.99997Z%22%20fill%3D%22%23505562%22%2F%3E%0A%3Cpath%20d%3D%22M4.93126%2014.1571L6.78106%203.71471H10.1375C11.1917%203.71471%2011.9824%203.98323%2012.5095%204.52027C13.0465%205.04736%2013.315%205.73358%2013.315%206.57892C13.315%207.44414%2013.0714%208.15522%2012.5841%208.71215C12.1067%209.25913%2011.4553%209.63705%2010.6298%209.8459L12.0619%2014.1571H10.3315L9.03364%2010.0249H7.24351L6.51254%2014.1571H4.93126ZM7.49711%208.59281H9.24248C9.99832%208.59281%2010.5901%208.42374%2011.0177%208.08561C11.4553%207.73753%2011.6741%207.26513%2011.6741%206.66842C11.6741%206.19106%2011.5249%205.81811%2011.2265%205.54959C10.9282%205.27113%2010.4558%205.1319%209.80936%205.1319H8.10874L7.49711%208.59281Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A"
      },
      "category": {
        "id": "connectors",
        "name": "Connectors"
      },
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "groups": [
        {
          "id": "endpoint",
          "label": "HTTP Endpoint"
        },
        {
          "id": "input",
          "label": "Payload"
        },
        {
          "id": "authentication",
          "label": "Authentication"
        },
        {
          "id": "output",
          "label": "Response Mapping"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:http-json:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "Method",
          "group": "endpoint",
          "type": "Dropdown",
          "value": "get",
          "choices": [
            {
              "name": "GET",
              "value": "get"
            },
            {
              "name": "POST",
              "value": "post"
            },
            {
              "name": "PATCH",
              "value": "patch"
            },
            {
              "name": "PUT",
              "value": "put"
            },
            {
              "name": "DELETE",
              "value": "delete"
            }
          ],
          "binding": {
            "type": "zeebe:input",
            "name": "method"
          }
        },
        {
          "label": "URL",
          "group": "endpoint",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "url"
          },
          "constraints": {
            "notEmpty": true,
            "pattern": {
              "value": "^(=|https?://).*",
              "message": "Must be a http(s) URL."
            }
          }
        },
        {
          "label": "Query Parameters",
          "description": "Map of query parameters to add to the request URL",
          "group": "endpoint",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "queryParameters"
          },
          "optional": true
        },
        {
          "label": "HTTP Headers",
          "description": "Map of HTTP headers to add to the request",
          "group": "endpoint",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "headers"
          },
          "optional": true
        },
        {
          "type": "Hidden",
          "value": "basic",
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.type"
          }
        },
        {
          "label": "Username",
          "group": "authentication",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.username"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Password",
          "group": "authentication",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.password"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Request Body",
          "description": "JSON payload to send with the request",
          "group": "input",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "body"
          },
          "optional": true
        },
        {
          "label": "Result Variable",
          "description": "Name of variable to store the response in",
          "group": "output",
          "type": "String",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultVariable"
          }
        },
        {
          "label": "Result Expression",
          "description": "Expression to map the response into process variables",
          "group": "output",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultExpression"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "REST Connector (Bearer Token Auth)",
      "id": "io.camunda.connectors.HttpJson.v1.bearerToken",
      "description": "[Deprecated] Replace with 'REST Connector' template.",
      "documentationRef": "https://docs.camunda.io/docs/components/modeler/web-modeler/connectors/available-connectors/rest/",
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%221%201%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M17.0335%208.99997C17.0335%2013.4475%2013.4281%2017.0529%208.98065%2017.0529C4.53316%2017.0529%200.927765%2013.4475%200.927765%208.99997C0.927765%204.55248%204.53316%200.947083%208.98065%200.947083C13.4281%200.947083%2017.0335%204.55248%2017.0335%208.99997Z%22%20fill%3D%22%23505562%22%2F%3E%0A%3Cpath%20d%3D%22M4.93126%2014.1571L6.78106%203.71471H10.1375C11.1917%203.71471%2011.9824%203.98323%2012.5095%204.52027C13.0465%205.04736%2013.315%205.73358%2013.315%206.57892C13.315%207.44414%2013.0714%208.15522%2012.5841%208.71215C12.1067%209.25913%2011.4553%209.63705%2010.6298%209.8459L12.0619%2014.1571H10.3315L9.03364%2010.0249H7.24351L6.51254%2014.1571H4.93126ZM7.49711%208.59281H9.24248C9.99832%208.59281%2010.5901%208.42374%2011.0177%208.08561C11.4553%207.73753%2011.6741%207.26513%2011.6741%206.66842C11.6741%206.19106%2011.5249%205.81811%2011.2265%205.54959C10.9282%205.27113%2010.4558%205.1319%209.80936%205.1319H8.10874L7.49711%208.59281Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A"
      },
      "category": {
        "id": "connectors",
        "name": "Connectors"
      },
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "groups": [
        {
          "id": "endpoint",
          "label": "HTTP Endpoint"
        },
        {
          "id": "input",
          "label": "Payload"
        },
        {
          "id": "authentication",
          "label": "Authentication"
        },
        {
          "id": "output",
          "label": "Response Mapping"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:http-json:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "Method",
          "group": "endpoint",
          "type": "Dropdown",
          "value": "get",
          "choices": [
            {
              "name": "GET",
              "value": "get"
            },
            {
              "name": "POST",
              "value": "post"
            },
            {
              "name": "PATCH",
              "value": "patch"
            },
            {
              "name": "PUT",
              "value": "put"
            },
            {
              "name": "DELETE",
              "value": "delete"
            }
          ],
          "binding": {
            "type": "zeebe:input",
            "name": "method"
          }
        },
        {
          "label": "URL",
          "group": "endpoint",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "url"
          },
          "constraints": {
            "notEmpty": true,
            "pattern": {
              "value": "^(=|https?://).*",
              "message": "Must be a http(s) URL."
            }
          }
        },
        {
          "label": "Query Parameters",
          "description": "Map of query parameters to add to the request URL",
          "group": "endpoint",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "queryParameters"
          },
          "optional": true
        },
        {
          "label": "HTTP Headers",
          "description": "Map of HTTP headers to add to the request",
          "group": "endpoint",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "headers"
          },
          "optional": true
        },
        {
          "type": "Hidden",
          "value": "bearer",
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.type"
          }
        },
        {
          "label": "Bearer Token",
          "group": "authentication",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "authentication.token"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Request Body",
          "description": "JSON payload to send with the request",
          "group": "input",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "body"
          },
          "optional": true
        },
        {
          "label": "Result Variable",
          "description": "Name of variable to store the response in",
          "group": "output",
          "type": "String",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultVariable"
          }
        },
        {
          "label": "Result Expression",
          "description": "Expression to map the response into process variables",
          "group": "output",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultExpression"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Template: Some Function",
      "id": "io.camunda.connectors.Template.v1",
      "description": "Describe this connector",
      "documentationRef": "https://docs.camunda.io/docs/components/modeler/web-modeler/connectors/available-connectors/template/",
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2218%22%20width%3D%2218%22%20viewBox%3D%220%200%2010%2010%22%20shape-rendering%3D%22geometricPrecision%22%3E%3Ctitle%3ESlack%3C%2Ftitle%3E%3Cg%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M0%2C0%20L0%2C10%20L10%2C10%20L10%2C0%20z%22%20fill%3D%22%23ecb12f%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
      },
      "category": {
        "id": "connectors",
        "name": "Connectors"
      },
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "groups": [
        {
          "id": "authentication",
          "label": "Authentication"
        },
        {
          "id": "compose",
          "label": "Compose"
        },
        {
          "id": "output",
          "label": "Output Mapping"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:template:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "OAuth Token",
          "group": "authentication",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "token"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Message",
          "group": "compose",
          "type": "Text",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "data.message"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Result Variable",
          "description": "Name of variable to store the response in",
          "group": "output",
          "type": "String",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultVariable"
          }
        },
        {
          "label": "Result Expression",
          "description": "Expression to map the response into process variables",
          "group": "output",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultExpression"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Update Properties - Order",
      "id": "cloud-element-templates.properties.UpdateProperties.order",
      "appliesTo": [
        "bpmn:ServiceTask"
      ],
      "properties": [
        {
          "id": "name",
          "type": "Hidden",
          "value": "task-name",
          "binding": {
            "type": "property",
            "name": "name"
          }
        },
        {
          "label": "Task Header 1",
          "type": "String",
          "value": "header-1-value",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "header-1-key"
          },
          "condition": {
            "equals": "TASK",
            "property": "name"
          }
        },
        {
          "label": "Task Header 2",
          "type": "String",
          "value": "header-2-value",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "header-2-key"
          }
        },
        {
          "label": "Input 1",
          "type": "String",
          "value": "input-1-source",
          "binding": {
            "type": "zeebe:input",
            "name": "input-1-target"
          },
          "condition": {
            "equals": "TASK",
            "property": "name"
          }
        },
        {
          "label": "Input 2",
          "type": "String",
          "optional": true,
          "binding": {
            "type": "zeebe:input",
            "name": "input-2-target"
          }
        },
        {
          "label": "Input 3",
          "type": "String",
          "value": "input-3-source",
          "binding": {
            "type": "zeebe:input",
            "name": "input-3-target"
          }
        },
        {
          "label": "Output 1",
          "type": "String",
          "value": "output-1-target",
          "binding": {
            "type": "zeebe:output",
            "source": "output-1-source"
          },
          "condition": {
            "equals": "TASK",
            "property": "name"
          }
        },
        {
          "label": "Output 2",
          "type": "String",
          "optional": true,
          "binding": {
            "type": "zeebe:output",
            "source": "output-2-source"
          }
        },
        {
          "label": "Output 3",
          "type": "String",
          "value": "output-3-target",
          "binding": {
            "type": "zeebe:output",
            "source": "output-3-source"
          }
        },
        {
          "label": "Property 1",
          "type": "String",
          "value": "property-1-value",
          "binding": {
            "type": "zeebe:property",
            "name": "property-1-name"
          },
          "condition": {
            "equals": "TASK",
            "property": "name"
          }
        },
        {
          "label": "Property 2",
          "type": "String",
          "optional": true,
          "binding": {
            "type": "zeebe:property",
            "name": "property-2-name"
          }
        },
        {
          "label": "Property 3",
          "type": "String",
          "value": "property-3-value",
          "binding": {
            "type": "zeebe:property",
            "name": "property-3-name"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "SendGrid Email Template Connector",
      "id": "io.camunda.connectors.SendGrid.v1.template",
      "description": "Send an Email via SendGrid Dynamic Template",
      "documentationRef": "https://docs.camunda.io/docs/components/modeler/web-modeler/connectors/available-connectors/sendgrid/",
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M0.285706%205.40847H5.43837V10.5611H0.285706V5.40847Z%22%20fill%3D%22white%22%2F%3E%0A%3Cpath%20d%3D%22M0.285706%205.40847H5.43837V10.5611H0.285706V5.40847Z%22%20fill%3D%22%2399E1F4%22%2F%3E%0A%3Cpath%20d%3D%22M5.43837%2010.5611L10.5611%2010.5616V15.6844H5.43837V10.5611Z%22%20fill%3D%22white%22%2F%3E%0A%3Cpath%20d%3D%22M5.43837%2010.5611L10.5611%2010.5616V15.6844H5.43837V10.5611Z%22%20fill%3D%22%2399E1F4%22%2F%3E%0A%3Cpath%20d%3D%22M0.285706%2015.6846L5.43837%2015.6844V15.7143H0.285706V15.6846ZM0.285706%2010.5619H5.43837V15.6844L0.285706%2015.6846V10.5619Z%22%20fill%3D%22%231A82E2%22%2F%3E%0A%3Cpath%20d%3D%22M5.43837%200.285706H10.5611V5.40847H5.43837V0.285706ZM10.5616%205.43837H15.7143V10.5611H10.5616V5.43837Z%22%20fill%3D%22%2300B3E3%22%2F%3E%0A%3Cpath%20d%3D%22M5.43837%2010.5611L10.5611%2010.5616V5.40847H5.43837V10.5611Z%22%20fill%3D%22%23009DD9%22%2F%3E%0A%3Cpath%20d%3D%22M10.5611%200.285706H15.7143V5.40847H10.5611V0.285706Z%22%20fill%3D%22%231A82E2%22%2F%3E%0A%3Cpath%20d%3D%22M10.5611%205.40847H15.7143V5.43837H10.5616L10.5611%205.40847Z%22%20fill%3D%22%231A82E2%22%2F%3E%0A%3C%2Fsvg%3E"
      },
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "groups": [
        {
          "id": "sendgrid",
          "label": "SendGrid API"
        },
        {
          "id": "sender",
          "label": "Sender"
        },
        {
          "id": "receiver",
          "label": "Receiver"
        },
        {
          "id": "template",
          "label": "Dynamic Email Template"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:sendgrid:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "SendGrid API Key",
          "group": "sendgrid",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "apiKey"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Name",
          "group": "sender",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "from.name"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Email Address",
          "group": "sender",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "from.email"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Name",
          "group": "receiver",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "to.name"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Email Address",
          "group": "receiver",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "to.email"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Template ID",
          "group": "template",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "template.id"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Template Data",
          "group": "template",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:input",
            "name": "template.data"
          },
          "constraints": {
            "notEmpty": true
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "SendGrid Email Connector",
      "id": "io.camunda.connectors.SendGrid.v1.content",
      "description": "Send an Email via SendGrid",
      "documentationRef": "https://docs.camunda.io/docs/components/modeler/web-modeler/connectors/available-connectors/sendgrid/",
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M0.285706%205.40847H5.43837V10.5611H0.285706V5.40847Z%22%20fill%3D%22white%22%2F%3E%0A%3Cpath%20d%3D%22M0.285706%205.40847H5.43837V10.5611H0.285706V5.40847Z%22%20fill%3D%22%2399E1F4%22%2F%3E%0A%3Cpath%20d%3D%22M5.43837%2010.5611L10.5611%2010.5616V15.6844H5.43837V10.5611Z%22%20fill%3D%22white%22%2F%3E%0A%3Cpath%20d%3D%22M5.43837%2010.5611L10.5611%2010.5616V15.6844H5.43837V10.5611Z%22%20fill%3D%22%2399E1F4%22%2F%3E%0A%3Cpath%20d%3D%22M0.285706%2015.6846L5.43837%2015.6844V15.7143H0.285706V15.6846ZM0.285706%2010.5619H5.43837V15.6844L0.285706%2015.6846V10.5619Z%22%20fill%3D%22%231A82E2%22%2F%3E%0A%3Cpath%20d%3D%22M5.43837%200.285706H10.5611V5.40847H5.43837V0.285706ZM10.5616%205.43837H15.7143V10.5611H10.5616V5.43837Z%22%20fill%3D%22%2300B3E3%22%2F%3E%0A%3Cpath%20d%3D%22M5.43837%2010.5611L10.5611%2010.5616V5.40847H5.43837V10.5611Z%22%20fill%3D%22%23009DD9%22%2F%3E%0A%3Cpath%20d%3D%22M10.5611%200.285706H15.7143V5.40847H10.5611V0.285706Z%22%20fill%3D%22%231A82E2%22%2F%3E%0A%3Cpath%20d%3D%22M10.5611%205.40847H15.7143V5.43837H10.5616L10.5611%205.40847Z%22%20fill%3D%22%231A82E2%22%2F%3E%0A%3C%2Fsvg%3E"
      },
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "groups": [
        {
          "id": "sendgrid",
          "label": "SendGrid API"
        },
        {
          "id": "sender",
          "label": "Sender"
        },
        {
          "id": "receiver",
          "label": "Receiver"
        },
        {
          "id": "content",
          "label": "Email Content"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:sendgrid:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "label": "SendGrid API Key",
          "group": "sendgrid",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "apiKey"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Name",
          "group": "sender",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "from.name"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Email Address",
          "group": "sender",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "from.email"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Name",
          "group": "receiver",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "to.name"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Email Address",
          "group": "receiver",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "to.email"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Subject",
          "group": "content",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "content.subject"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Content Type",
          "group": "content",
          "type": "String",
          "feel": "optional",
          "value": "text/plain",
          "binding": {
            "type": "zeebe:input",
            "name": "content.type"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Body",
          "group": "content",
          "type": "Text",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "content.value"
          },
          "constraints": {
            "notEmpty": true
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Slack: Send Message",
      "id": "io.camunda.connectors.Slack.v1",
      "description": "Send a message to a channel or user",
      "documentationRef": "https://docs.camunda.io/docs/components/modeler/web-modeler/connectors/available-connectors/slack/",
      "icon": {
        "contents": "data:image/svg+xml;utf8,%3Csvg%20width%3D%2218%22%20height%3D%2218%22%20%20viewBox%3D%220%200%20127%20127%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cpath%20d%3D%22M27.2%2080c0%207.3-5.9%2013.2-13.2%2013.2C6.7%2093.2.8%2087.3.8%2080c0-7.3%205.9-13.2%2013.2-13.2h13.2V80zm6.6%200c0-7.3%205.9-13.2%2013.2-13.2%207.3%200%2013.2%205.9%2013.2%2013.2v33c0%207.3-5.9%2013.2-13.2%2013.2-7.3%200-13.2-5.9-13.2-13.2V80z%22%20fill%3D%22%23E01E5A%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M47%2027c-7.3%200-13.2-5.9-13.2-13.2C33.8%206.5%2039.7.6%2047%20.6c7.3%200%2013.2%205.9%2013.2%2013.2V27H47zm0%206.7c7.3%200%2013.2%205.9%2013.2%2013.2%200%207.3-5.9%2013.2-13.2%2013.2H13.9C6.6%2060.1.7%2054.2.7%2046.9c0-7.3%205.9-13.2%2013.2-13.2H47z%22%20fill%3D%22%2336C5F0%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M99.9%2046.9c0-7.3%205.9-13.2%2013.2-13.2%207.3%200%2013.2%205.9%2013.2%2013.2%200%207.3-5.9%2013.2-13.2%2013.2H99.9V46.9zm-6.6%200c0%207.3-5.9%2013.2-13.2%2013.2-7.3%200-13.2-5.9-13.2-13.2V13.8C66.9%206.5%2072.8.6%2080.1.6c7.3%200%2013.2%205.9%2013.2%2013.2v33.1z%22%20fill%3D%22%232EB67D%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M80.1%2099.8c7.3%200%2013.2%205.9%2013.2%2013.2%200%207.3-5.9%2013.2-13.2%2013.2-7.3%200-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3%200-13.2-5.9-13.2-13.2%200-7.3%205.9-13.2%2013.2-13.2h33.1c7.3%200%2013.2%205.9%2013.2%2013.2%200%207.3-5.9%2013.2-13.2%2013.2H80.1z%22%20fill%3D%22%23ECB22E%22%2F%3E%0A%3C%2Fsvg%3E%0A"
      },
      "category": {
        "id": "connectors",
        "name": "Connectors"
      },
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "groups": [
        {
          "id": "authentication",
          "label": "Authentication"
        },
        {
          "id": "compose",
          "label": "Compose"
        },
        {
          "id": "output",
          "label": "Output Mapping"
        }
      ],
      "properties": [
        {
          "type": "Hidden",
          "value": "io.camunda:slack:1",
          "binding": {
            "type": "zeebe:taskDefinition:type"
          }
        },
        {
          "type": "Hidden",
          "value": "chat.postMessage",
          "binding": {
            "type": "zeebe:input",
            "name": "method"
          }
        },
        {
          "label": "OAuth Token",
          "group": "authentication",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "token"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Channel/User Name",
          "group": "compose",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "data.channel"
          },
          "constraints": {
            "notEmpty": true,
            "pattern": {
              "value": "^(#|@).*",
              "message": "Must be a #channel or @user."
            }
          }
        },
        {
          "label": "Message",
          "group": "compose",
          "type": "Text",
          "feel": "optional",
          "binding": {
            "type": "zeebe:input",
            "name": "data.text"
          },
          "constraints": {
            "notEmpty": true
          }
        },
        {
          "label": "Result Variable",
          "description": "Name of variable to store the response in",
          "group": "output",
          "type": "String",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultVariable"
          }
        },
        {
          "label": "Result Expression",
          "description": "Expression to map the response into process variables",
          "group": "output",
          "type": "Text",
          "feel": "required",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "resultExpression"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "A versioned template",
      "id": "foop.example.versioned.template",
      "description": "A template with multiple versions",
      "version": 1,
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "properties": [
        {
          "label": "Task Header <b>",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "b"
          }
        }
      ]
    },
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "A versioned template",
      "id": "foop.example.versioned.template",
      "description": "A template with multiple versions",
      "version": 2,
      "appliesTo": [
        "bpmn:Task"
      ],
      "elementType": {
        "value": "bpmn:ServiceTask"
      },
      "properties": [
        {
          "label": "Task Header <b>",
          "type": "String",
          "feel": "optional",
          "binding": {
            "type": "zeebe:taskHeader",
            "key": "b"
          }
        }
      ]
    }
  ];
  // return context.keys().map(key => context(key)).flat();
  // throw new Error('Function not implemented.');
}

