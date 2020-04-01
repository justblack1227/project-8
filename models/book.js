'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init({
        id: { 
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: { 
            type: Sequelize.STRING, 
            allowNull: false,
            validate: {
                notNull: { 
                    msg: 'Please provide a "Title"'
                },
                notEmpty: { 
                    msg: 'Please provide a "Title"'
                }
            }
        },
        author: { 
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: { 
                    msg: 'Please provide an "Author"'
                },
                notEmpty: { 
                    msg: 'Please provide an "Author"'
                }
            }
        },
        genre: { 
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: { 
                    msg: 'Please provide an "Genre"'
                },
                notEmpty: { 
                    msg: 'Please provide a "Genre"'
                }
            }
        }, 
        year: { 
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notNull: { 
                    msg: 'Please provide a "Year"'
                },
                notEmpty: { 
                    msg: 'Please provide a "Year"'
                },
                len: {
                    args: [4,4], 
                    msg: 'Please provide a "Year" with four digits'
                }, 
                lessThanYear(value) {
                    const date = new Date().getFullYear();
                    if (value > date ) {
                        throw new Error('The value for year is greater than the current year')
                    }
                }
            }
        },
    }, { sequelize });

    return Book;
};