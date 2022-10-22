import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'Acer', price: '1900$', description: 'Синего цвета, прямые'},
    {id: '2', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'Macbook', price: '1400$', description: 'Зеленого цвета, теплая'},
    {id: '3', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'Asus', price: '1600$', description: 'Синего цвета, прямые'},
    {id: '4', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'Lenevo', price: '900$', description: 'Зеленого цвета, теплая'},
    {id: '5', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'Samsung', price: '1300$', description: 'Синего цвета, прямые'},
    {id: '6', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'Huawei', price: '9800$', description: 'Зеленого цвета, теплая'},
    {id: '7', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'HP', price: '11900$', description: 'Синего цвета, прямые'},
    {id: '8', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'Toshiba', price: '2300$', description: 'Зеленого цвета, теплая'},
    {id: '9', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'MSI', price: '3300$', description: 'Зеленого цвета, теплая'},
    {id: '10', img: 'https://ixbt.online/live/topics/preview/00/02/70/32/9849bde4b0.jpg',title: 'Ryzer', price: '2300$', description: 'Зеленого цвета, теплая'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('mongodb+srv://Bekzod:6862442@ecommerce.u0lgm.mongodb.net/ecommerce?retryWrites=true&w=majority', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)} $`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
