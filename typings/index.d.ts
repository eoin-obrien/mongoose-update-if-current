import { Schema } from 'mongoose';

export declare function updateIfCurrentPlugin<T>(schema: Schema<T>, options?: PluginOptions): void;

export declare interface PluginOptions {
  strategy?: 'version' | 'timestamp';
}
