export type Image = {
  imageId: number;
  originalFilename: string;
  uploadFileURL: string;
};

export type Pets = {
  petId: number;
  images: Image;
  name: string;
  age: number;
  sex: string;
  species: string;
  information: string;
  memberId: number;
  createdAt: string;
  modifiedAt: string;
};
