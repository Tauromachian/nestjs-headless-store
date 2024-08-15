import { SetMetadata } from '@nestjs/common';
import { authConstants } from '../constants';

export const Public = () => SetMetadata(authConstants.IS_PUBLIC_KEY, true);
