import config from '../../../../config';

export default {
  url: `${config.current.apiURL}/images`,
  prepareData(formData) {
    const file = formData.get('files[0]');

    formData.append('images', file);
    formData.delete('files[0]');
  },
  isSuccess(response) {
    return response.length;
  },
  process(images) {
    images.forEach(image => this.jodit.selection.insertImage(image));
  },
};
