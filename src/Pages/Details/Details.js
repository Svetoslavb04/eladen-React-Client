import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getVehicle } from "../../services/vehicleService";

import { useLoadingContext } from "../../contexts/LoadingContext";
import { useNotificationContext, types } from "../../contexts/NotificationContext";
import { useShoppingCartContext } from "../../contexts/ShoppingCartContext";
import { useWishListContext } from "../../contexts/WishListContext";

import { Typography, Button, CircularProgress, FavoriteIcon } from "../../mui-imports";

import CommonPage from "../CommonPage/CommonPage";

import './Details.scss';

export default function Details(props) {

    const { isLoading, setIsLoading } = useLoadingContext();

    const { shoppingCartItems, setShoppingCartItems } = useShoppingCartContext();
    const { wishListItems, setWishListItems } = useWishListContext();

    const { popNotification } = useNotificationContext();

    const { _id } = useParams();

    const [vehicle, setVehicle] = useState({});

    const [selectedTabs, setSelectedTabs] = useState([true, false]);

    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {

        setIsLoading(true);

        getVehicle(_id)
            .then(vehicle => {

                if (wishListItems.includes(vehicle._id)) {
                    setIsFavourite(true);
                }

                setVehicle(vehicle);
                setIsLoading(false);

            });
    }, []);

    const handleAddToCartClick = () => {

        if (shoppingCartItems) {
            if (!shoppingCartItems.includes(vehicle._id)) {
                setShoppingCartItems(prev => [...prev, vehicle._id]);
            }
        } else {

            setShoppingCartItems([vehicle._id]);
        }

        popNotification(`Vehicle ${vehicle.make} ${vehicle.model} added to cart!`, types.success);

    }

    const handleFavouriteClick = () => {

        if (isFavourite) {
            popNotification(`Vehicle ${vehicle.make} ${vehicle.model} removed from wish list!`, types.success);
        } else {
            popNotification(`Vehicle ${vehicle.make} ${vehicle.model} added to wish list!`, types.success);
        }
        
        setIsFavourite(prev => !prev);

        if (wishListItems) {
            if (wishListItems.includes(vehicle._id)) {

                setWishListItems(wishListItems.filter(element => element != vehicle._id));

            } else {

                setWishListItems(prev => [...prev, vehicle._id]);

            }
        } else {

            setWishListItems([vehicle._id]);

        }


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
                            onClick={handleAddToCartClick}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            component='p'
                            className={`wish-list-icon${!isFavourite ? ' wish-list-icon-not-selected' : ''}`}
                            variant={isFavourite ? 'contained' : 'outlined'}
                            onClick={handleFavouriteClick}
                        >
                            <FavoriteIcon className="wish-list-icon" fontSize="small" />
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
                                                <div key={key} className="details-specification-section-row">
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