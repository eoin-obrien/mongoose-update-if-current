import { Schema } from 'mongoose';

export declare function updateIfCurrentPlugin(schema: Schema, options?: PluginOptions): void;

export declare interface PluginOptions {
  strategy?: 'version' | 'timestamp';
}
