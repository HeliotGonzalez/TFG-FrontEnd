import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyChallengeItem } from '../daily-challenge-item';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}
  
  storeUser(data: string[]) {
    return this.http.post(`${this.apiUrl}/register`, { data });
  }

  logIn(email: string, password: string) {
    return this.http.get(`${this.apiUrl}/login/${email}/${password}`);
  }

  verifyOtp(payload: { email: string, otp: string }) {
    return this.http.post(`${this.apiUrl}/verificar-otp`, { data: [payload.email, payload.otp] });
  } 

  verifyPasswordOtp(email: string, otp: string) {
    return this.http.get(`${this.apiUrl}/verificar-otp-password/${email}/${otp}`); 
  }

  forgotPassword(email: string) {
    return this.http.get(`${this.apiUrl}/forgot-password/${email}`);
  }

  resetPassword(payload: { email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/reset-password`, { data: [payload.email, payload.password] });
  }

  storeWord(data: { nombre: string; descripcion: string; etiquetas: string[] }) {
    console.log(data);
    return this.http.post(`${this.apiUrl}/registerWord`, data);
  }

  getWords(letter: string){
    return this.http.get(`${this.apiUrl}/getWords/${letter}`);
  }

  getVideos(descripcion: string, userID: number) {
    return this.http.get(`${this.apiUrl}/getVideos/${descripcion}/${userID}`);
  }

  sendVideoLikes(id: number, likes: number, dislikes: number, action: string, userID: number) {
    const data = { id, likes, dislikes, action, userID };
    return this.http.post(`${this.apiUrl}/videoLikes`, {data});
  }

  storeVideoInDictionary(data: { videoID: number, userID: number }) {
    return this.http.post(`${this.apiUrl}/storeVideoInDictionary`, data);
  }

  deleteVideoFromDictionary(data: { videoID: number, userID: number }) {
    return this.http.post(`${this.apiUrl}/deleteVideoFromDictionary`, {data});
  }

  reportAVideo(data: { videoID: number, userID: number, reason: string }) {
    return this.http.post(`${this.apiUrl}/reportVideo`, {data});
  }

  cancelMyAction(data: { videoID: number, userID: number, action: string }) {
    return this.http.post(`${this.apiUrl}/cancelMyAction`, {data});
  }

  getPersonalDictionary(userID: number) { 
    return this.http.get(`${this.apiUrl}/getPersonalDictionary/${userID}`);
  }

  storeVideo(videoUrl: string, corregido: boolean = false, significado: string, userID: number) {
    let data = { videoUrl, corregido, significado, userID };
    console.log(data);
    return this.http.post(`${this.apiUrl}/storeVideo`, data);
  }
  
  getVideosByWord(word: string) {
    return this.http.get(`${this.apiUrl}/getVideosByWord/${word}`);
  }

  getRandomWords(){
    return this.http.get(`${this.apiUrl}/getRandomWords`);
  }

  testYourself($userID: number){
    return this.http.get(`${this.apiUrl}/testYourself/${$userID}`);
  }

  getRecentlyUploadedVideos(userID: number) {
    return this.http.get(`${this.apiUrl}/getRecentlyUploadedVideos/${userID}`);
  }

  getVideosByThemes(userID: number, tags: string[]) {
    return this.http.get(`${this.apiUrl}/getVideosByThemes/${userID}/${tags}`);
  }

  getTagsFromApi(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}/getTags`);
  }

  getVideosUncorrected(userID: number){
    return this.http.get(`${this.apiUrl}/getVideosUncorrected/${userID}`);
  }

  correctVideo(data: { videoId: number, action: 'accept' | 'deny', comment: string }) {
    return this.http.post(`${this.apiUrl}/correctVideo`, data);
  }

  getVideosCorrected(userID: number) {
    return this.http.get(`${this.apiUrl}/getVideosCorrected/${userID}`);
  }

  getRequiredWords(){
    return this.http.get(`${this.apiUrl}/getRequiredWords`);
  }

  getUserData(ownerID: number, userID: number){
    return this.http.get(`${this.apiUrl}/getUserData/${ownerID}/${userID}`);
  }

  updateProfile(formData: FormData, userID: number) {
    return this.http.patch(`${this.apiUrl}/updateProfile/${userID}`, formData);
  }

  getUserDataByName(username: string, userID: number){
    return this.http.get(`${this.apiUrl}/getUserDataByName/${username}/${userID}`);
  }

  sendFriendRequest(userID: number, friendID: number) {
    console.log('Enviando');
    return this.http.post(`${this.apiUrl}/sendFriendRequest`, { userID, friendID });
  }

  getPendingFriendRequest(to: number){
    return this.http.get(`${this.apiUrl}/getPendingFriendRequest/${to}`);
  }

  amIBeingAddedByOwner(from: number, to: number){
    return this.http.get(`${this.apiUrl}/amIBeingAddedByOwner/${from}/${to}`);
  }

  isMyFriend(from: number, to: number){
    return this.http.get(`${this.apiUrl}/isMyFriend/${from}/${to}`);
  }

  acceptFriend(from: number, to: number){
    return this.http.post(`${this.apiUrl}/acceptFriend`, {from, to});
  }

  denyRequest(from: number, to: number){
    return this.http.post(`${this.apiUrl}/denyRequest`, {from, to});
  }

  getNotFriendsUsers(userID: number){
    return this.http.get(`${this.apiUrl}/getNotFriendsUsers/${userID}`);
  }

  getFriends(userID: number){
    return this.http.get(`${this.apiUrl}/getFriends/${userID}`);
  }

  getMyFriendsVideos(userID: number){
    return this.http.get(`${this.apiUrl}/getMyFriendsVideos/${userID}`);
  }

  getMyConversations(userID: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/getMyConversations/${userID}`);
  }

  sendChatMessage(from: number, to: number, text: string) {
    return this.http.post(`${this.apiUrl}/sendMessage`, { from, to, text });
  }

  getExpertStatData(){
    return this.http.get(`${this.apiUrl}/getExpertStatData`);
  }

  sendSuggestion(suggestion: string){
    return this.http.post(`${this.apiUrl}/sendSuggestion`, { suggestion });
  }

  getUnseenVideosCorrected(userID: number){
    return this.http.get(`${this.apiUrl}/getUnseenVideosCorrected/${userID}`);
  }

  getDailyChallenge(): Observable<DailyChallengeItem[]> {
    return this.http.get<DailyChallengeItem[]>(`${this.apiUrl}/getDailyChallenge`);
  }

  checkLastDailyChallenge(userID: number) {
    return this.http.get(`${this.apiUrl}/checkLastDailyChallenge/${userID}`);
  }

  sendResults(correctAnswers: number, userID: number){
    return this.http.post(`${this.apiUrl}/sendResults`, { correctAnswers, userID });
  }
}
