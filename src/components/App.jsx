import Notiflix from 'Notiflix';
import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { GetImage } from '../../src/services/GetImage';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import css from './App.module.css';

export const App = () => {
  const [value, setValue] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
 
  useEffect(() => {
    if (value === '') {
      return;
    }
    setLoader(prevLoader => !prevLoader);

    GetImage(value, page)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(new Error('Not found'));
      })
      .then(response => {
        if (response.hits.length > 0) {
          setImages(prevImages =>
            page === 1 ? response.hits : [...prevImages, ...response.hits]
          );
        } else {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
      })
      .catch(error => setError(error))
      .finally(() => setLoader(false));
  }, [value, page]);

  const onSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    setValue(form.elements.input.value);
    setPage(1);
    setImages([]);
    form.reset();
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  const openModal = largeImageURL => {
    setLargeImageURL(largeImageURL);
    setShowModal(true);
  };

  const closeModal = e => {
    if (e.target.nodeName === 'DIV') setShowModal(false);
  };

  const closeESCModal = e => {
    setShowModal(false);
  };

  return (
    <>
      <div className={css.app}>
        {error && <h1>{error.message}</h1>}
        <Searchbar onSubmit={onSubmit} />
        {images.length > 0 && (
          <ImageGallery images={images} openModal={openModal} />
        )}
        {isLoader && <Loader />}
        {!isLoader && images.length > 0 && <Button onLoadMore={onLoadMore} />}
        {showModal && (
          <Modal
            closeESCModal={closeESCModal}
            closeModal={closeModal}
            largeImageURL={largeImageURL}
          />
        )}
      </div>
    </>
  );
};
