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

    static async addContribution(userId, username, amount, description) {
        const userRef = doc(db, 'users', userId);
        let user = await this.getUser(userId);
        if (!user) {
            user = {
                userId,
                username,
                totalContribution: 0,
                contributions: []
            };
            await setDoc(userRef, user);
        }
        const newContribution = {
            amount,
            description,
            date: new Date().toISOString()
        };
        await updateDoc(userRef, {
            totalContribution: (user.totalContribution || 0) + amount,
            contributions: [...(user.contributions || []), newContribution]
        });
        return newContribution;
    }

    static async getAllUsers() {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        return usersSnapshot.docs.map(doc => doc.data());
    }

    static async getTopContributors(limit = 5) {
        // Este método requiere obtener todos los usuarios y ordenarlos
        // Por simplicidad, se puede implementar con una consulta a Firestore en producción
        return [];
    }
}

module.exports = User; 