const { db } = require('../config/firebase');
const { doc, getDoc, setDoc, updateDoc, collection, getDocs } = require('firebase/firestore');

class User {
    static async getUser(userId) {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            return null;
        }
        
        return userDoc.data();
    }

    static async createOrUpdateUser(userId, userData) {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...userData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }

    static async updateCard(userId, cardData) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            card: {
                ...cardData,
                updatedAt: new Date().toISOString()
            }
        });
    }

    static async createUser(userId, username) {
        const userRef = doc(db, 'users', userId);
        const newUser = {
            userId,
            username,
            contribution: 0,
            role: 'MEMBER'
        };
        
        await setDoc(userRef, newUser);
        return newUser;
    }

    static async updateUser(userId, userData) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, userData);
    }

    static async addContribution(userId, amount) {
        const user = await this.getUser(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        await this.updateUser(userId, {
            contribution: user.contribution + amount
        });

        return user.contribution + amount;
    }

    static async getAllUsers() {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        return usersSnapshot.docs.map(doc => doc.data());
    }

    static async getTopContributors(limit = 10) {
        const users = await this.getAllUsers();
        return users
            .sort((a, b) => b.contribution - a.contribution)
            .slice(0, limit);
    }
}

module.exports = User; 