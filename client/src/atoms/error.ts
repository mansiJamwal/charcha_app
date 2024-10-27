import {atom} from 'recoil';

export const errorRecoil=atom<string>({
    key:'errorRecoil',
    default:'',
})