import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNotificationContext } from "../../contexts/NotificationContext";

import { getVehicle } from "../../services/vehicleService";

import { useLoadingContext } from "../../contexts/LoadingContext";

import { Typography, Button, CircularProgress, FavoriteIcon } from "../../mui-imports";

import CommonPage from "../CommonPage/CommonPage";

import './Details.scss';

export default function Details(props) {

    const { isLoading, setIsLoading } = useLoadingContext();

    const { getItem, setItem } = useLocalStorage();

    const { popNotification } = useNotificationContext();

    const { _id } = useParams();

    const [vehicle, setVehicle] = useState({});

    const [selectedTabs, setSelectedTabs] = useState([true, false]);

    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {

        setIsLoading(true);

        getVehicle(_id)
            .then(vehicle => {

                if (getItem('wishList').includes(vehicle._id)) {
                    setIsFavourite(true);
                }

                setVehicle(vehicle);
                setIsLoading(false);
            });
    }, []);

    const handleAddToCartClick = () => {

        let shoppingCart = getItem('shoppingCart');

        if (shoppingCart) {
            if (!shoppingCart.includes(vehicle._id)) {
                shoppingCart.push(vehicle._id);
            }
        } else {

            shoppingCart = [vehicle._id];
        }

        setItem('shoppingCart', shoppingCart);

        popNotification(`Vehicle ${vehicle.make} ${vehicle.model} added to cart!`, 'success');
    }

    const handleFavouriteClick = () => {

        setIsFavourite(prev => !prev);

        let wishList = getItem('wishList');

        if (wishList) {
            if (wishList.includes(vehicle._id)) {
                wishList = wishList.filter(element => element != vehicle._id);
            } else {

                wishList.push(vehicle._id);
            }
        } else {

            wishList = [vehicle._id];
        }

        setItem('wishList', wishList);
        
        popNotification(`Vehicle ${vehicle.make} ${vehicle.model} added to wish list!`, 'success');

    }

    const handleTabSelect = (index) => {

        const newSelectedTabs = [false, false];

        newSelectedTabs[index] = true;

        setSelectedTabs(newSelectedTabs);
    }

    return (
        <CommonPage
            breadcrumbs={
                isLoading
                    ? []
                    : ['Home', 'Catalog', `${vehicle.make} ${vehicle.model}`]
            }
        >
            <div className="details-info-wrapper">
                <div className="details-image-wrapper">
                    {
                        isLoading
                            ? <CircularProgress sx={{ margin: 'auto' }} />
                            : <img className="details-image" src={vehicle.imageUrl} alt="vehicle" />
                    }
                </div>
                <div className="details-info">
                    <div className="details-heading-wrapper">
                        <h1 className="details-info-heading-text">{vehicle.make}</h1>
                        <h1 className="details-info-heading-text">{vehicle.model}</h1>
                    </div>
                    <div className="details-description-wrapper">
                        <Typography
                            component="p"
                            className="details-info-description-text"
                        >
                            {vehicle.description?.length >= 200
                                ? vehicle.description.slice(0, 200) + '...'
                                : vehicle.description

                            }
                        </Typography>
                    </div>
                    <div className="details-meta-wrapper">
                        <Typography
                            component="p"
                            className="details-info-meta-text"
                        >
                            Year: {vehicle.year}
                        </Typography>
                        <Typography
                            component="p"
                            className="details-info-meta-text"
                        >
                            Mileage: {vehicle.mileage}
                        </Typography>
                        <Typography
                            component="p"
                            className="details-info-meta-text"
                        >
                            VIN: {vehicle.VIN}
                        </Typography>
                    </div>
                    <div className="details-price-wrapper">
                        <Typography
                            component="p"
                            className="details-info-price-text"
                        >
                            €{vehicle.price}
                        </Typography>
                    </div>
                    <div className="details-buy-wrapper">
                        <Button
                            variant="contained"
                            className="details-info-buy-now-text"
                            onClick={handleAddToCartClick}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            component='p'
                            className={`details-info-wish-list-icon${!isFavourite ? ' details-info-wish-list-icon-not-selected' : ''}`}
                            variant={isFavourite ? 'contained' : 'outlined'}
                            onClick={handleFavouriteClick}
                        >
                            <FavoriteIcon className="details-wish-list-icon" fontSize="small" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="details-vehicle-tabs-wrapper">
                <div className="details-vehicle-tabs-list">
                    <button
                        className={`details-vehicle-tab-button${selectedTabs[0] ? ' details-vehicle-tab-button-selected' : ''}`}
                        onClick={handleTabSelect.bind(null, 0)}
                    >
                        Description
                    </button>
                    <button
                        className={`details-vehicle-tab-button${selectedTabs[1] ? ' details-vehicle-tab-button-selected' : ''}`}
                        onClick={handleTabSelect.bind(null, 1)}
                    >
                        Specification
                    </button>
                </div>
                <div className="details-vehicle-tabs">
                    {
                        selectedTabs[0]
                            ? <div className="details-vehicle-tabs-description-tab">
                                <Typography
                                    variant="h4"
                                    className="details-vehicle-tab-header-text"
                                >
                                    Full vehicle description
                                </Typography>
                                <Typography
                                    component="p"
                                    className="details-info-description-text"
                                >
                                    {vehicle.description}
                                </Typography>
                            </div>
                            : <div className="details-vehicle-tabs-specification-tab">
                                <Typography
                                    variant="h4"
                                    className="details-vehicle-tab-header-text"
                                >
                                    Specification
                                </Typography>
                                <div className="details-specification-section">
                                    <div className="details-specification-section-header">
                                        <Typography
                                            className="details-specification-section-header-text"
                                        >
                                            General
                                        </Typography>
                                    </div>
                                    {
                                        ['Make', 'Model', 'Category', 'Year', 'Mileage', 'VIN'].map(key => {
                                            return (
                                                <div className="details-specification-section-row">
                                                    <div className="details-specification-row-key-wrapper">
                                                        <Typography
                                                            className="details-specification-row-key"
                                                        >
                                                            {key}
                                                        </Typography>
                                                    </div>
                                                    <div className="details-specification-row-value-wrapper">
                                                        <Typography
                                                            className="details-specification-row-value"
                                                        >
                                                            {key != 'VIN' ? vehicle[key.toLowerCase()] : vehicle[key]}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }


                                </div>
                            </div>
                    }
                </div>
            </div>
        </CommonPage>
    )
}