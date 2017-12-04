'use strict';

import 'jest';
import { Example } from '../src';

describe('Example', () => {
    it('Should be pass sanity', () => {
        expect(typeof Example).toBe('function');
    });

    it('Should be able to create new instance', () => {
        expect(typeof new Example()).toBe('object');
    });
});
